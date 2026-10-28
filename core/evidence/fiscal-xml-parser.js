const MAX_XML_BYTES = 5 * 1024 * 1024;

function firstByLocalName(root, name) {
  return [...root.getElementsByTagName("*")].find((node) => node.localName === name) ?? null;
}

function allByLocalName(root, name) {
  return [...root.getElementsByTagName("*")].filter((node) => node.localName === name);
}

function textOf(root, name) {
  return firstByLocalName(root, name)?.textContent?.trim() ?? "";
}

function numberOrNull(value) {
  if (value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function firstUsableGtin(product) {
  const candidates = [textOf(product, "cEAN"), textOf(product, "cEANTrib")];
  return candidates.find((value) => value && !/^SEM GTIN$/i.test(value.trim())) || null;
}

/**
 * Parse a user-provided NF-e/NFC-e XML document in the browser.
 * This is extraction for human review, not fiscal validation or authenticity proof.
 */
export function parseFiscalXml(xmlText) {
  if (typeof xmlText !== "string" || !xmlText.trim()) {
    throw new Error("empty_xml");
  }
  if (new TextEncoder().encode(xmlText).byteLength > MAX_XML_BYTES) {
    throw new Error("xml_too_large");
  }
  if (/<!DOCTYPE|<!ENTITY/i.test(xmlText)) {
    throw new Error("xml_doctype_not_allowed");
  }

  const parser = new DOMParser();
  const document = parser.parseFromString(xmlText, "application/xml");
  if (document.querySelector("parsererror")) throw new Error("invalid_xml");

  const info = firstByLocalName(document, "infNFe");
  if (!info) throw new Error("nfe_info_not_found");

  const issuerNode = firstByLocalName(info, "emit");
  const recipientNode = firstByLocalName(info, "dest");
  const ideNode = firstByLocalName(info, "ide");
  const totalNode = firstByLocalName(info, "ICMSTot");
  const products = allByLocalName(info, "det").map((detail) => {
    const product = firstByLocalName(detail, "prod");
    if (!product) return null;
    return {
      lineNumber: numberOrNull(detail.getAttribute("nItem")),
      code: textOf(product, "cProd") || null,
      gtin: firstUsableGtin(product),
      description: textOf(product, "xProd") || null,
      ncm: textOf(product, "NCM") || null,
      cfop: textOf(product, "CFOP") || null,
      unit: textOf(product, "uCom") || null,
      quantity: numberOrNull(textOf(product, "qCom")),
      unitPrice: numberOrNull(textOf(product, "vUnCom")),
      total: numberOrNull(textOf(product, "vProd"))
    };
  }).filter(Boolean);

  const key = info.getAttribute("Id")?.replace(/^NFe/, "") || "";
  const result = {
    documentType: "NFE_XML",
    accessKey: key || null,
    issuer: issuerNode ? {
      name: textOf(issuerNode, "xNome") || null,
      tradeName: textOf(issuerNode, "xFant") || null,
      cnpj: textOf(issuerNode, "CNPJ") || textOf(issuerNode, "CPF") || null
    } : null,
    recipient: recipientNode ? {
      name: textOf(recipientNode, "xNome") || null,
      cnpj: textOf(recipientNode, "CNPJ") || textOf(recipientNode, "CPF") || null
    } : null,
    number: textOf(ideNode ?? info, "nNF") || null,
    series: textOf(ideNode ?? info, "serie") || null,
    issueDate: textOf(ideNode ?? info, "dhEmi") || textOf(ideNode ?? info, "dEmi") || null,
    total: numberOrNull(textOf(totalNode ?? info, "vNF")),
    items: products,
    provenance: {
      source: "user_supplied_xml",
      extractedAt: new Date().toISOString(),
      validation: "parsed_only_not_fiscally_validated"
    }
  };

  const missingFields = [];
  if (!result.issuer?.name && !result.issuer?.cnpj) missingFields.push("issuer");
  if (!result.number) missingFields.push("document_reference");
  if (!result.items.length) missingFields.push("line_items");
  if (result.items.some((item) => item.quantity === null)) missingFields.push("quantities");
  if (result.items.some((item) => item.total === null)) missingFields.push("values");

  return { ...result, missingFields: [...new Set(missingFields)] };
}
