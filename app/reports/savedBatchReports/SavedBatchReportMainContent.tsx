import { Calendar } from "@nextui-org/react";
import { parseDate } from "@internationalized/date";

export default function SavedBatchReports() {
    return (
        <main>
            <div>
                <section>Saved Batch Reports</section>
                <div className="flex gap-x-4">
                    <Calendar aria-label="Date (No Selection)" />
                    <Calendar aria-label="Date (Uncontrolled)" defaultValue={parseDate("2020-02-03")} />
                </div>
            </div>
        </main>
    );
}