"use client";
import { useEffect } from "react";
import { useAtom } from "jotai";
import { OverallAtom } from "./atoms/OverallAtom";
import { usePathname } from "next/navigation";
import { OverallInt } from "./atoms/OverallAtom";
import { TransactionsAtom, TransactionInt } from "./atoms/TransactionsAtom";
import { AssessmentsAtom, AssessmentInt } from "./atoms/AssessmentsAtom";
import Overall from "./Overall/Overall";
import Assessments from "./Assessments/Assessments";
import Transactions from "./Transactions/Transactions";

export default function PropertyDetails() {
  const pathName = usePathname();
  const [overallData, setOverallData] = useAtom(OverallAtom);
  const [transactionsData, setTransactionsData] = useAtom(TransactionsAtom);
  const [assessmentsData, setAssessmentsData] = useAtom(AssessmentsAtom);

  const getData = async () => {
    const parcelId = pathName.split("/zillow/")[1];
    const res: {
      overall: OverallInt;
      transactions: TransactionInt[];
      assessments: AssessmentInt[];
    } = await fetch(`/api/search/zillow/${parcelId}`, {
      cache: "no-store",
    }).then((data) => data.json());
    setOverallData(res.overall);
    setTransactionsData(res.transactions);
    setAssessmentsData(res.assessments);
  };
  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <Overall overall={overallData} />
      <Assessments assessments={assessmentsData} />
      <Transactions transactions={transactionsData} />
    </div>
  );
}
