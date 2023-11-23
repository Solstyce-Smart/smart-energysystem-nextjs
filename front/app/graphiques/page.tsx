"use client";

import React, { useEffect, useState } from "react";
import LineChart from "./_components/LineChart";
import { Button } from "@/components/ui/button";

const Graphiques = () => {
  const [data, setData] = useState([]);
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newData, setNewData] = useState([]);
  const [tagsListed, setTagsListed] = useState([]);

  useEffect(() => {
    const fetchDatas = async (
      url: string,
      setDataCallback: (data: any) => void
    ) => {
      try {
        const res = await fetch(url, {
          method: "GET",
          headers: {
            Origin: "https://smart-energysystem.fr",
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          console.log("Erreur");
          throw new Error("HTTP error " + res.status);
        }

        const data = await res.json();
        setDataCallback(data);
        const listOfTags = data.tagsLive.map((tag, i) => {
          return tag.tagName;
        });
        listOfTags.sort();
        setTagsListed(listOfTags);
      } catch (error) {
        console.log(error);
      }
    };

    fetchDatas(
      "https://vps.smart-energysystem.fr:3001/1/installations/1",
      setData
    );
  }, []);

  const fetchData = async (
    url: string,
    setDataCallback: (data: any) => void
  ) => {
    try {
      const res = await fetch(url, {
        method: "GET",
        headers: {
          Origin: "https://smart-energysystem.fr",
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        console.log("Erreur");
        throw new Error("HTTP error " + res.status);
      }

      const data = await res.json();
      setDataCallback(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex w-full h-full max-w-[100vw] flex-wrap">
      {!loading && <LineChart datas={newData} series={series} />}
      {tagsListed.map((tag, i) => (
        <Button
          key={i}
          variant="ghost"
          onClick={async () => {
            setLoading(true);
            await fetchData(
              `https://vps.smart-energysystem.fr:3001/elastic/dataindex/1425275/${tag}`,
              (data) => {
                setNewData(data);
                setSeries((prev) => {
                  const newSeries = [...prev, data];
                  return newSeries;
                });
                setLoading(false);
              }
            );
          }}
        >
          {tag}
        </Button>
      ))}
    </div>
  );
};

export default Graphiques;
