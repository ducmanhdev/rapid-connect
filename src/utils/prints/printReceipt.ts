import { default as EscPosEncoder } from "@manhnd/esc-pos-encoder";
import { print } from "@/sdk";
import dayjs from "dayjs";
import { currencyFormatter, timestampToDate } from "../format";
import { reverseObject } from "../transform";
import { CARD_TYPE, ENTRY_MODE } from "pax-ts";

export async function printReceipt(historyDetail: any) {
  const encoder = new EscPosEncoder()
  const result = encoder
    .initialize()
    .bold(true)
    .align("center")
    .text("RECEIPT")
    .bold(false)
    .newline()
    .text("Merchant/Customer Receipt")
    .newline()
    .newline()
    .align("left")
    .table(
        [
            { width: 22, align: "left" },
            { width: 25, align: "right" },
        ],
        [
            [
            dayjs(timestampToDate(historyDetail?.traceInformation?.timeStamp)).format("MM/DD/YYYY"), 
            dayjs(timestampToDate(historyDetail?.traceInformation?.timeStamp)).format("hh:mm:ss")
            ],
            ["Transaction #:", historyDetail?.traceInformation?.transactionNumber],
            ["Card Type:", reverseObject(CARD_TYPE)[historyDetail?.accountInformation?.cardType]],
            ["Account:", "************" + historyDetail?.accountInformation?.account],
            ["Entry:", reverseObject(ENTRY_MODE)[historyDetail?.accountInformation?.entryMode.padStart(2, '0')]],
            ["Payment ID:", historyDetail?.traceInformation?.referenceNumber],

            ["SUB TOTAL:", currencyFormatter((historyDetail?.amountInformation?.approveAmount / 100) - (historyDetail?.amountInformation?.tipAmount / 100))],
            ["TIP:", currencyFormatter(historyDetail?.amountInformation?.tipAmount / 100)],
        ]
    )
    .printLineFull("-")
    .bold(true)
    .table(
        [
            { width: 22, align: "left" },
            { width: 25, align: "right" },
        ],
        [
            ["TOTAL:", currencyFormatter(historyDetail?.amountInformation?.approveAmount / 100)],
        ]
    )
    .bold(false)
    .newline()
    .table(
        [
            { width: 22, align: "left" },
            { width: 25, align: "right" },
        ],
        [
            ["TIP:", "________________________"],
        ]
    )
    .newline()
    .table(
        [
            { width: 22, align: "left" },
            { width: 25, align: "right" },
        ],
        [
            ["TOTAL:", "________________________"],
        ]
    )
    .newline()
    .table(
        [
            { width: 22, align: "left" },
            { width: 25, align: "right" },
        ],
        [
            ["Ref. Number:", historyDetail?.hostInformation?.hostReferenceNumber],
            ["Auth. Code:", historyDetail?.hostInformation?.authCode],
            ["Response:", historyDetail?.hostInformation?.hostResponseMessage],
            ["TC:", (historyDetail?.additionalInformationRaw[0]).slice(3)],
            ["TVR:", (historyDetail?.additionalInformationRaw[1]).slice(4)],
            ["AID:", (historyDetail?.additionalInformationRaw[2]).slice(4)],
            ["TSI:", (historyDetail?.additionalInformationRaw[3]).slice(4)],
            ["ATC:", (historyDetail?.additionalInformationRaw[4]).slice(4)],
            ["APPLAB:", (historyDetail?.additionalInformationRaw[5]).slice(7)],
            ["APPN:", (historyDetail?.additionalInformationRaw[6]).slice(6)]
        ]
    )
    .align("center")
    .newline()
    .newline()
    .text("Cardholder acknowledges receipt of goods and obligations set forth by the cardholder's agreement with issuer.")
    .newline()
    .printLineFull("-")
    .newline()
    .size(1)
    .text(historyDetail?.accountInformation?.cardHolder.trim())
    .newline()
    .cut()
    .encode();
  await print(result).catch((error) => console.error(error));
}