import React, { useState, ChangeEvent, FunctionComponent } from "react";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";

import { useGoogleMapsScript, Libraries } from "use-google-maps-script";

interface searchBoxProps {
  onSelectAddress: (
    address: string,
    latitude: number | null,
    longitude: number | null
  ) => void;
  defaultValue: string;
  form: any;
}

const libraries: Libraries = ["places"];

export function SearchBox({
  onSelectAddress,
  defaultValue,
  form,
}: searchBoxProps) {
  const { isLoaded, loadError } = useGoogleMapsScript({
    googleMapsApiKey: "AIzaSyCR-uZ_JoitorYTckvODC2NCPJ3IS73llg" ?? "",
    libraries,
  });

  if (!isLoaded) return null;
  if (loadError) return <div>Error loading</div>;

  return (
    <ReadySearchBox
      onSelectAddress={onSelectAddress}
      defaultValue={defaultValue}
      form={form}
    />
  );
}

function ReadySearchBox({
  onSelectAddress,
  defaultValue,
  form,
}: searchBoxProps) {
  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete({ debounce: 300, defaultValue });

  const newFieldValue = "";

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    if (e.target.value === "") {
      onSelectAddress("", null, null);
    }
  };
  const handleSelect = async (address: string) => {
    form.setValue("address", address);
    setValue(address, false);
    clearSuggestions();
    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      onSelectAddress(address, lat, lng);
      console.log("📍 Coordinates: ", { lat, lng });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <FormField
      control={form.control}
      name="address"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel className="text-bold text-primary text-lg">
            Addresse
          </FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  disabled={!ready}
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "justify-between capitalize",
                    !field.value && "text-muted-foreground text-sm italic"
                  )}
                >
                  {field.value
                    ? `📍 ${field.value}`
                    : "Sélectionner une entreprise"}
                  <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="p-0">
              <Command onChange={handleChange}>
                <CommandInput
                  disabled={!ready}
                  autoComplete="off"
                  placeholder="Chercher une addresse"
                  className="h-9"
                />
                <CommandEmpty>Pas d'adresse trouvée.</CommandEmpty>
                <CommandGroup>
                  {status === "OK" &&
                    data.map((address) => (
                      <CommandItem
                        onSelect={handleSelect}
                        value={address.description}
                        key={address.place_id}
                      >
                        {address.description}
                      </CommandItem>
                    ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
