import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FinancialProps {
  // TODO
}

const Financial = ({
  pasDeTemps,
  CONSOP,
  PVPRESEAU,
  PVPBAT,
  PVPCONSO,
  RESEAUPCONSO,
  BTMP,
  IRVEPSUM,
  PVPSUM,
  BATPCONSO,
}: any) => {
  const tarifAchat = 0.2;
  const tarifRevente = 0.13;

  const getFilteredData = (datas: any[], pasDeTemps: string) => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const currentDay = currentDate.getDate();

    const filterFunction = (itemDate: Date) => {
      switch (pasDeTemps) {
        case "journalier":
          return (
            itemDate.getFullYear() === currentYear &&
            itemDate.getMonth() + 1 === currentMonth &&
            itemDate.getDate() === currentDay
          );
        case "mensuel":
          return (
            itemDate.getFullYear() === currentYear &&
            itemDate.getMonth() + 1 === currentMonth
          );
        case "annuel":
          return itemDate.getFullYear() === currentYear;
        default:
          return false;
      }
    };

    return datas.filter((item) => filterFunction(new Date(item.dateReq)));
  };
  const CONSOPData = getFilteredData(CONSOP, pasDeTemps);
  const PVPRESEAUData = getFilteredData(PVPRESEAU, pasDeTemps);
  const PVPBATData = getFilteredData(PVPBAT, pasDeTemps);
  const PVPCONSOData = getFilteredData(PVPCONSO, pasDeTemps);
  const RESEAUPCONSOData = getFilteredData(RESEAUPCONSO, pasDeTemps);
  const BTMPData = getFilteredData(BTMP, pasDeTemps);
  const IRVEPSUMData = getFilteredData(IRVEPSUM, pasDeTemps);
  const PVPSUMData = getFilteredData(PVPSUM, pasDeTemps);
  const BATPCONSOData = getFilteredData(BATPCONSO, pasDeTemps);

  function calculateTotalWithFilter(data: any[], tarif: number) {
    const total = data.reduce((acc, item, index, array) => {
      if (index > 0) {
        const prevValue = array[index - 1].value;
        const currValue = item.value;
        const hours = 5 / 60;
        const consumption = ((currValue + prevValue) / 2) * hours;
        return acc + Math.abs(consumption);
      }
      return acc;
    }, 0);

    return parseFloat((total * tarif).toFixed(2));
  }

  function calculateTotalInKwH(data: any[]) {
    const total = data.reduce((acc, item, index, array) => {
      if (index > 0) {
        const prevValue = array[index - 1].value;
        const currValue = item.value;
        const hours = 5 / 60;
        const consumption = ((currValue + prevValue) / 2) * hours;
        return acc + Math.abs(consumption);
      }
      return acc;
    }, 0);

    return parseFloat(total.toFixed(2));
  }

  const theorique = calculateTotalWithFilter(CONSOPData, tarifAchat);
  const surplus = calculateTotalWithFilter(PVPRESEAUData, tarifRevente);
  const totalProd = calculateTotalInKwH(PVPSUMData);

  const surplusInKwH = calculateTotalInKwH(PVPRESEAUData);
  const consoBatiment = calculateTotalInKwH(BTMPData);
  const consoIRVE = calculateTotalInKwH(IRVEPSUMData);

  const achatsEvites = () => {
    let batpconso = calculateTotalWithFilter(BATPCONSOData, tarifAchat);
    let pvpconso = calculateTotalWithFilter(PVPCONSOData, tarifAchat);
    let total = batpconso + pvpconso;
    let totalWithTarif = total * tarifAchat;
    return parseFloat(totalWithTarif.toFixed(2));
  };
  const productionAutoconsommee = calculateTotalInKwH(PVPCONSOData);
  const batterieAutoconsommee = calculateTotalInKwH(PVPBATData);

  const achatsReseau = calculateTotalWithFilter(RESEAUPCONSOData, tarifAchat);
  const achatsReseauInKwH = calculateTotalInKwH(RESEAUPCONSOData);
  const factureReelle = parseFloat(
    (achatsReseau - surplus - achatsEvites()).toFixed(2)
  );

  const economies = (theorique - factureReelle).toFixed(2);
  const consoTotale = (consoBatiment + consoIRVE).toFixed(2);
  return (
    <div className="flex w-full h-full">
      <Accordion type="multiple" className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>
            <div className="flex w-full justify-between pr-2">
              <span className="text-primary underline font-semibold">
                Mes économies
              </span>
              <span>- {economies} €</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex w-full justify-between pr-2">
              <span>Facture théorique sans SMART</span>
              <span>{theorique} €</span>
            </div>
          </AccordionContent>
          <AccordionContent>
            <Accordion type="multiple" className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  <div className="flex w-full justify-between pr-2">
                    <span>Facture réelle avec SMART</span>
                    <span>{factureReelle} €</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex w-full justify-between pr-2">
                    <span>Revente de surplus</span>
                    <span>- {surplus} €</span>
                  </div>
                </AccordionContent>
                <AccordionContent>
                  <div className="flex w-full justify-between pr-2">
                    <span>Achats évités</span>
                    <span>- {achatsEvites()} €</span>
                  </div>
                </AccordionContent>
                <AccordionContent>
                  <div className="flex w-full justify-between pr-2">
                    <span>Achats sur le réseau</span>
                    <span>{achatsReseau} €</span>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>
            <div className="flex w-full justify-between pr-2">
              <span className="text-primary underline font-semibold">
                Consommation totale en kwH
              </span>
              <span>{consoTotale} kwH</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex w-full justify-between pr-2">
              <span>Bâtiment</span>
              <span>{consoBatiment} kwH</span>
            </div>
          </AccordionContent>
          <AccordionContent>
            <div className="flex w-full justify-between pr-2">
              <span>Véhicules électriques</span>
              <span>{consoIRVE} kwH</span>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>
            <div className="flex w-full justify-between pr-2">
              <span className="text-primary underline font-semibold">
                Production en kwH
              </span>
              <span>{totalProd} kwH</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex w-full justify-between pr-2">
              <span>Production solaire revendue</span>
              <span>{surplusInKwH} kwH</span>
            </div>
          </AccordionContent>
          <AccordionContent>
            <div className="flex w-full justify-between pr-2">
              <span>Production solaire autoconsommée en direct</span>
              <span>{productionAutoconsommee} kwH</span>
            </div>
          </AccordionContent>
          <AccordionContent>
            <div className="flex w-full justify-between pr-2">
              <span>Production solaire autoconsommée via batterie</span>
              <span>{batterieAutoconsommee} kwH</span>
            </div>
          </AccordionContent>
          <AccordionContent>
            <div className="flex w-full justify-between pr-2">
              <span>Achat sur les réseaux</span>
              <span>{achatsReseauInKwH} kwH</span>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Financial;
