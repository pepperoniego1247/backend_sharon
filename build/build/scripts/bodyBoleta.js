"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.newBoletaVenta = void 0;
const numbersToText_1 = require("../scripts/numbersToText");
const newBoletaVenta = (products, customer, saleProduct, personaId, personaToken, ruc) => __awaiter(void 0, void 0, void 0, function* () {
    const listProducts = [];
    const totalAmountWithoutIgv = saleProduct["totalAmount"] / (1 + 0.18);
    const igvTotalAmount = saleProduct["totalAmount"] - totalAmountWithoutIgv;
    const lastDocumentResponse = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield fetch("https://back.apisunat.com/personas/lastDocument", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    personaId: personaId,
                    personaToken: personaToken,
                    type: "03",
                    serie: "B001"
                })
            });
            if (!response.ok)
                throw new Error("ERROR EN PETICION LASTDOCUMENT");
            return response.json();
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    });
    const { suggestedNumber } = yield lastDocumentResponse();
    //* PRECIO SIN IGV = precioTotal / (1 + 0.18)
    //* IGV = precioTotal - precioSinIgv;
    products.forEach((product, index) => {
        const priceWithoutIgv = (product['price'] / (1 + 0.18));
        const igvProduct = (product["price"] - Number(priceWithoutIgv));
        listProducts.push({
            "cbc:ID": {
                "_text": index + 1 //*
            },
            "cbc:InvoicedQuantity": {
                "_attributes": {
                    "unitCode": product["type"] //*
                },
                "_text": product["quantity"] //*
            },
            "cbc:LineExtensionAmount": {
                "_attributes": {
                    "currencyID": "PEN"
                },
                "_text": (priceWithoutIgv * product["quantity"]).toFixed(2)
            },
            "cac:PricingReference": {
                "cac:AlternativeConditionPrice": {
                    "cbc:PriceAmount": {
                        "_attributes": {
                            "currencyID": "PEN"
                        },
                        "_text": product["price"]
                    },
                    "cbc:PriceTypeCode": {
                        "_text": "01"
                    }
                }
            },
            "cac:TaxTotal": {
                "cbc:TaxAmount": {
                    "_attributes": {
                        "currencyID": "PEN"
                    },
                    "_text": (igvProduct * product["quantity"]).toFixed(2)
                },
                "cac:TaxSubtotal": [
                    {
                        "cbc:TaxableAmount": {
                            "_attributes": {
                                "currencyID": "PEN"
                            },
                            "_text": (priceWithoutIgv * product["quantity"]).toFixed(2)
                        },
                        "cbc:TaxAmount": {
                            "_attributes": {
                                "currencyID": "PEN"
                            },
                            "_text": (igvProduct * product["quantity"]).toFixed(2)
                        },
                        "cac:TaxCategory": {
                            "cbc:Percent": {
                                "_text": 18
                            },
                            "cbc:TaxExemptionReasonCode": {
                                "_text": "10"
                            },
                            "cac:TaxScheme": {
                                "cbc:ID": {
                                    "_text": "1000"
                                },
                                "cbc:Name": {
                                    "_text": "IGV"
                                },
                                "cbc:TaxTypeCode": {
                                    "_text": "VAT"
                                }
                            }
                        }
                    }
                ]
            },
            "cac:Item": {
                "cbc:Description": {
                    "_text": product["name"]
                }
            },
            "cac:Price": {
                "cbc:PriceAmount": {
                    "_attributes": {
                        "currencyID": "PEN"
                    },
                    "_text": priceWithoutIgv.toFixed(2)
                }
            }
        });
    });
    return {
        "personaId": personaId,
        "personaToken": personaToken,
        "fileName": `${ruc}-03-B001-${suggestedNumber}`,
        "documentBody": {
            "cbc:UBLVersionID": {
                "_text": "2.1"
            },
            "cbc:CustomizationID": {
                "_text": "2.0"
            },
            "cbc:ID": {
                "_text": `B001-${suggestedNumber}`
            },
            "cbc:IssueDate": {
                "_text": new Date().toLocaleDateString("en-GB").split("/").reverse().map(part => part.padStart(2, '0')).join("-")
            },
            "cbc:IssueTime": {
                "_text": new Intl.DateTimeFormat('default', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).format(new Date())
            },
            "cbc:InvoiceTypeCode": {
                "_attributes": {
                    "listID": "0101"
                },
                "_text": "03"
            },
            "cbc:Note": [
                {
                    "_text": (0, numbersToText_1.numeroALetras)(saleProduct["totalAmount"]),
                    "_attributes": {
                        "languageLocaleID": "1000"
                    }
                }
            ],
            "cbc:DocumentCurrencyCode": {
                "_text": "PEN"
            },
            "cac:AccountingSupplierParty": {
                "cac:Party": {
                    "cac:PartyIdentification": {
                        "cbc:ID": {
                            "_attributes": {
                                "schemeID": "6"
                            },
                            "_text": ruc
                        }
                    },
                    "cac:PartyLegalEntity": {
                        "cbc:RegistrationName": {
                            "_text": "VERA ZAVALETA SHAROON"
                        },
                        "cac:RegistrationAddress": {
                            "cbc:AddressTypeCode": {
                                "_text": "0000"
                            },
                            "cac:AddressLine": {
                                "cbc:Line": {
                                    "_text": "AV. CUBA NRO. 389 URB. EL RECREO ET. 2 TRUJILLO TRUJILLO LA LIBERTAD"
                                }
                            }
                        }
                    }
                }
            },
            "cac:AccountingCustomerParty": {
                "cac:Party": {
                    "cac:PartyIdentification": {
                        "cbc:ID": {
                            "_attributes": {
                                "schemeID": "1"
                            },
                            "_text": customer["dni"]
                        }
                    },
                    "cac:PartyLegalEntity": {
                        "cbc:RegistrationName": {
                            "_text": `${(customer["firstName"] === "") ? "---" : customer["firstName"]} ${customer["lastName"]}`
                        },
                        "cac:RegistrationAddress": {
                            "cac:AddressLine": {
                                "cbc:Line": {
                                    "_text": customer["address"]
                                }
                            }
                        }
                    }
                }
            },
            "cac:TaxTotal": {
                "cbc:TaxAmount": {
                    "_attributes": {
                        "currencyID": "PEN"
                    },
                    "_text": igvTotalAmount.toFixed(2)
                },
                "cac:TaxSubtotal": [
                    {
                        "cbc:TaxableAmount": {
                            "_attributes": {
                                "currencyID": "PEN"
                            },
                            "_text": totalAmountWithoutIgv.toFixed(2)
                        },
                        "cbc:TaxAmount": {
                            "_attributes": {
                                "currencyID": "PEN"
                            },
                            "_text": igvTotalAmount.toFixed(2)
                        },
                        "cac:TaxCategory": {
                            "cac:TaxScheme": {
                                "cbc:ID": {
                                    "_text": "1000"
                                },
                                "cbc:Name": {
                                    "_text": "IGV"
                                },
                                "cbc:TaxTypeCode": {
                                    "_text": "VAT"
                                }
                            }
                        }
                    }
                ]
            },
            "cac:LegalMonetaryTotal": {
                "cbc:LineExtensionAmount": {
                    "_attributes": {
                        "currencyID": "PEN"
                    },
                    "_text": totalAmountWithoutIgv.toFixed(2)
                },
                "cbc:TaxInclusiveAmount": {
                    "_attributes": {
                        "currencyID": "PEN"
                    },
                    "_text": saleProduct["totalAmount"]
                },
                "cbc:PayableAmount": {
                    "_attributes": {
                        "currencyID": "PEN"
                    },
                    "_text": saleProduct["totalAmount"]
                }
            },
            "cac:InvoiceLine": listProducts
        }
    };
});
exports.newBoletaVenta = newBoletaVenta;
