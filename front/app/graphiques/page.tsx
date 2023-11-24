"use client";

import React, { useEffect, useState } from "react";
import LineChart from "./_components/LineChart";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
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

  const form = useForm();

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

  const handleClick = async (tag: string) => {
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
  };

  return (
    <>
      <div className="flex w-full bg-slate-200 py-8 px-4 mb-4">
        {!loading && <LineChart datas={newData} series={series} />}
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(() => {
            handleClick(form.getValues("tag"));
            form.reset({ tag: "" });
          })}
          className="space-y-6 flex justify-center items-center flex-col mx-auto"
        >
          <FormField
            control={form.control}
            name="tag"
            render={({ field }) => (
              <FormItem>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selectionner la variable" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {tagsListed.map((tag, i) => {
                      return <SelectItem value={tag}>{tag}</SelectItem>;
                    })}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Ajouter</Button>
        </form>
      </Form>
      <Button
        onClick={() => {
          setSeries([]);
        }}
        variant="ghost"
        className=" flex justify-center items-center flex-col mx-auto mt-3"
      >
        Reset
      </Button>
    </>
  );
};

export default Graphiques;
