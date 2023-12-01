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
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import dotenv from "dotenv";
import axios from "axios";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

import variables from "./variables.json";

const Graphiques = () => {
  const [data, setData] = useState([]);
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newData, setNewData] = useState([]);
  const [tagsListed, setTagsListed] = useState([]);
  const [grouped, setGrouped] = useState([
    {
      var: "",
      name: "",
      unit: "",
    },
  ]);

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

        const data: {
          id: number;
          ewonId: string;
          name: string;
          tagsLive: {
            tagName: string;
            value: number;
            quality: string;
          }[];
        } = await res.json();
        setDataCallback(data);

        const getVariableValue = (data: any, tagName: string) => {
          const tag = data.tagsLive.find((tag: any) => tag.tagName === tagName);
          return tag ? tag.value : 0;
        };

        const numberOfIRVE = getVariableValue(data, "IRVE_NB");
        const numberOfPV = getVariableValue(data, "PV_NB");
        const numberOfBAT = getVariableValue(data, "BAT_NB");
        const numberOfMeter = getVariableValue(data, "METER_NB");

        const groupedData = variables
          .map((variable) => {
            if (variable.var.includes("IRVEi")) {
              const irveArray = [];
              for (let i = 1; i <= numberOfIRVE; i++) {
                const newVar = `${variable.var.replace(/IRVEi/, `IRVE${i}`)}`;
                const newName = `${variable.name} IRVE ${i}`;
                irveArray.push({ ...variable, var: newVar, name: newName });
              }
              return irveArray;
            } else if (variable.var.includes("PVi")) {
              const pvArray = [];
              for (let i = 1; i <= numberOfPV; i++) {
                const newVar = `${variable.var.replace(/PVi/, `PV${i}`)}`;
                const newName = `${variable.name} PV ${i}`;
                pvArray.push({ ...variable, var: newVar, name: newName });
              }
              return pvArray;
            } else if (variable.var.includes("BATi")) {
              const batArray = [];
              for (let i = 1; i <= numberOfBAT; i++) {
                const newVar = `${variable.var.replace(/BATi/, `BAT${i}`)}`;
                const newName = `${variable.name} BAT ${i}`;
                batArray.push({ ...variable, var: newVar, name: newName });
              }
              return batArray;
            } else if (variable.var.includes("METERi")) {
              const meterArray = [];
              for (let i = 1; i <= numberOfMeter; i++) {
                const newVar = `${variable.var.replace(/METERi/, `METER${i}`)}`;
                const newName = `${variable.name} METER ${i}`;
                meterArray.push({ ...variable, var: newVar, name: newName });
              }
              return meterArray;
            } else {
              return [variable];
            }
          })
          .flat();
        groupedData.sort((a, b) => a.var.localeCompare(b.var));
        setGrouped(groupedData);
      } catch (error) {
        console.log(error);
      }
    };

    fetchDatas(
      "https://vps.smart-energysystem.fr:3001/1/installations/1",
      setData
    );
  }, []);

  const form = useForm({
    defaultValues: {
      tag: "",
    },
  });

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
        //@ts-ignore
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
      <Form {...form} control={form.control}>
        <form
          onSubmit={form.handleSubmit(() => {
            console.log(form.getValues("tag"));

            handleClick(form.getValues("tag"));
            form.reset({ tag: "" });
          })}
          className="space-y-6 flex justify-center items-center flex-col mx-auto"
        >
          <FormField
            name="tag"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "justify-between",
                          !field.value && "text-muted-foreground text-sm italic"
                        )}
                      >
                        {field.value ? field.value : "Sélectionner un tag"}
                        <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="p-0">
                    <Command>
                      <CommandInput
                        placeholder="Chercher un tag"
                        className="h-9"
                      />
                      <ScrollArea className="max-h-72 w-full rounded-md border">
                        <CommandEmpty>Pas de tags trouvés.</CommandEmpty>
                        <CommandGroup>
                          {grouped.map((tag) => (
                            <CommandItem
                              value={tag.var}
                              key={tag.var}
                              onSelect={() => {
                                form.setValue("tag", tag.var);
                              }}
                            >
                              {tag.var}
                              <CheckIcon
                                className={cn(
                                  "ml-auto h-4 w-4",
                                  tag.var === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </ScrollArea>
                    </Command>
                  </PopoverContent>
                </Popover>
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
