import { Text } from "@react-pdf/renderer";
import { styles } from "./styles";
import { format } from "date-fns";

type Props = {
  docType: string;
  downloadedBy?: string;
};

export function PdfFooter({ docType, downloadedBy }: Props) {
  const stamp = format(new Date(), "MM/dd/yyyy h:mm a");
  return (
    <Text style={styles.pageFooter} fixed>
      U.S. Floor, Kitchen &amp; Bath &middot; {docType} &middot; {stamp}
      {downloadedBy ? ` · ${downloadedBy}` : ""}
    </Text>
  );
}
