import { columns } from "./column";
import Services from "@/services";
import OverviewPage from "@/components/custom/overview-page";

export default function ReceiveLogs() {
    return <OverviewPage
        columns={columns}
        source={Services.TransactionInbound}/>
}