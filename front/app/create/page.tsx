"use client";

import React, { useMemo, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import logo from "@/public/logo.jpg";
import { zodResolver } from "@hookform/resolvers/zod";
import { GoogleMap, Marker } from "@react-google-maps/api";

import {
  Form,
  FormControl,
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import dotenv from "dotenv";
import axios from "axios";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import { ArrowLeft, Battery, Loader } from "lucide-react";
import { SearchBox } from "./_components/SearchBox";

const roles = [
  { label: "Administrateur", value: 3 },
  { label: "Responsable technique", value: 2 },
  { label: "Visiteur", value: 1 },
] as const;
const fakeOrganizations = [
  { label: "Solstyce", value: "Solstyce", logo: logo },
  { label: "SMART", value: "SMART", logo: logo },
  { label: "Mobilize", value: "Mobilize", logo: logo },
] as const;

dotenv.config();

const userSchema = z.object({
  email: z
    .string({ required_error: "Merci de renseigner un email valide." })
    .email(),
  lastname: z.string({ required_error: "Merci de renseigner un nom valide." }),
  firstname: z.string({
    required_error: "Merci de renseigner un prénom valide.",
  }),
  organization: z.string({
    required_error: "Merci de renseigner une entreprise valide.",
  }),
  role: z.number({ required_error: "Merci de renseigner un rôle valide." }),
});

const installationSchema = z.object({
  ewonId: z.string({
    required_error: "Merci de renseigner un identifiant valide.",
  }),
  name: z.string({ required_error: "Merci de renseigner un nom valide." }),
  address: z.string({
    required_error: "Merci de renseigner une adresse valide.",
  }),
  latitude: z.number({
    required_error: "Merci de renseigner une latitude valide.",
  }),
  longitude: z.number({
    required_error: "Merci de renseigner une longitude valide.",
  }),
  tarifAchat: z.number({
    required_error: "Merci de renseigner un tarif d'achat valide.",
  }),
  tarifRevente: z.number({
    required_error: "Merci de renseigner un tarif de revente valide.",
  }),
});

// Form

const Create = () => {
  const [createUser, setCreateUser] = useState(false);
  const [createInstallation, setCreateInstallation] = useState(false);
  const [ewonIdChecked, setEwonIdChecked] = useState(false);
  const [nameChecked, setNameChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [revente, setRevente] = useState(false);
  const [confirm, setConfirm] = useState(false);

  const { setValue, watch } = useForm({
    defaultValues: {
      ewonId: undefined || "",
      name: undefined || "",
      address: undefined || "",
      latitude: 0,
      longitude: 0,
      tarifAchat: 0,
      tarifRevente: 0,
    },
  });

  const checkEwon = async (ewonId: string) => {
    try {
      if (!ewonId) {
        throw new Error("Merci de renseigner un Ewon ID valide.");
      }
      if (ewonId === "test") {
        setEwonIdChecked(true);
        return;
      }

      const data = new URLSearchParams();
      const t2maccount = process.env.NEXT_PUBLIC_T2MACCOUNT || "";
      const t2musername = process.env.NEXT_PUBLIC_T2MUSERNAME || "";
      const t2mpassword = process.env.NEXT_PUBLIC_T2MPASSWORD || "";
      const t2mdeveloperid = process.env.NEXT_PUBLIC_T2MID || "";

      data.append("id", ewonId);
      data.append("t2maccount", t2maccount);
      data.append("t2musername", t2musername);
      data.append("t2mpassword", t2mpassword);
      data.append("t2mdeveloperid", t2mdeveloperid);

      const res = await axios.post(
        "https://m2web.talk2m.com/t2mapi/getewon",
        data
      );

      if (res.data.ewon.status === "online") {
        setLoading(false);
        setEwonIdChecked(true);
      }
    } catch (error) {
      setLoading(false);
      toast({
        title: "Il s'est produit une erreur : ",
        description: (
          <>
            <pre className="mt-2 w-[340px] rounded-md bg-red-800 p-4">
              <code className="text-white">
                {/*@ts-ignore */}
                {JSON.stringify(error.message, null, 2)}
              </code>
            </pre>
            <p className="mt-2 font-semibold">
              Merci de vérifier l'ID de l'Ewon renseigné.
            </p>
          </>
        ),
      });
    }
  };

  const checkName = async (name: string) => {
    if (!name) return;
    try {
      setLoading(true);
      const res = await axios.get(
        "https://vps.smart-energysystem.fr:3001/installations"
      );

      for (let i = 0; i < res.data.length; i++) {
        if (res.data[i].name === name) {
          toast({
            title: "Il s'est produit une erreur : ",
            description: (
              <>
                <pre className="mt-2 w-[340px] rounded-md bg-red-800 p-4">
                  <code className="text-white">
                    {JSON.stringify(
                      "Le nom de la centrale existe déjà.",
                      null,
                      2
                    )}
                  </code>
                </pre>
                <p className="mt-2 font-semibold">
                  Merci de vérifier le nom de la centrale renseigné.
                </p>
              </>
            ),
          });
          setLoading(false);
          return;
        }
      }

      // Si la boucle ne retourne pas avant ce point, cela signifie que le nom n'a pas été trouvé
      setLoading(false);
      setNameChecked(true);
    } catch (error) {
      toast({
        title: "Il s'est produit une erreur : ",
        description: (
          <>
            <pre className="mt-2 w-[340px] rounded-md bg-red-800 p-4">
              <code className="text-white">
                {/*@ts-ignore */}
                {JSON.stringify(error.message, null, 2)}
              </code>
            </pre>
            <p className="mt-2 font-semibold">
              Merci de vérifier le nom de la centrale renseigné.
            </p>
          </>
        ),
      });
      setLoading(false);
    }
  };

  const address = watch("address");
  const lat = watch("latitude");
  const lng = watch("longitude");

  let center = useMemo(() => ({ lat: lat, lng: lng }), [lat, lng]);

  const defaultForm = useForm();

  const userForm = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
  });

  const installationForm = useForm<z.infer<typeof installationSchema>>({
    resolver: zodResolver(installationSchema),
  });

  // @ts-ignore
  const form: ReturnType<typeof useForm> = createUser
    ? userForm
    : createInstallation
    ? installationForm
    : defaultForm;

  async function handleSubmitUser(data: z.infer<typeof userSchema>) {
    await fetch(`https://vps.smart-energysystem.fr:3001/users`, {
      method: "POST",
      headers: {
        Origin: "https://smart-energysystem.fr",
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: data.email,
        role: data.role,
      }),
    })
      .then((res) => res.json())
      .catch((error) => {
        toast({
          description: (
            <div className="mt-2 w-auto rounded-md bg-red-600 p-4">
              <span className="text-white">
                L'utilisateur {data.firstname} {data.lastname} n'a pas pu être
                créé.
              </span>
              <div>
                <pre className="mt-2 w-[340px] rounded-md bg-red-800 p-4">
                  <code className="text-white">
                    {/*@ts-ignore */}
                    {JSON.stringify(error.message, null, 2)}
                  </code>
                </pre>
              </div>
            </div>
          ),
        });
      })
      .then(() => {
        toast({
          description: (
            <div className="mt-2 w-auto rounded-md bg-green-600 p-4">
              <span className="text-white">
                L'utilisateur {data.firstname} {data.lastname} a été créé avec
                succès !
              </span>
            </div>
          ),
        });
      });
  }

  async function handleSubmitInstallation(
    data: z.infer<typeof installationSchema>
  ) {
    await fetch(`https://vps.smart-energysystem.fr:3001/installations`, {
      method: "POST",
      headers: {
        Origin: "https://smart-energysystem.fr",
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ewonId: data.ewonId,
        name: data.name,
        abo: 0,
        tarifs: [
          {
            tarifAchat: [
              {
                value: data.tarifAchat ? data.tarifAchat : 0,
                dates: {
                  dateDebut: Date.now(),
                  dateFin: null,
                },
              },
            ],
            tarifRevente: [
              {
                value: data.tarifRevente ? data.tarifRevente : 0,
                dates: {
                  dateDebut: Date.now(),
                  dateFin: null,
                },
              },
            ],
          },
        ],
        address: [
          {
            address: data.address,
            latitude: data.latitude,
            longitude: data.longitude,
          },
        ],

        lastSynchroDate: Date.now(),
      }),
    })
      .then((res) => res.json())
      .then(() => {
        toast({
          description: (
            <div className="mt-2 w-auto rounded-md bg-green-600 p-4">
              <span className="text-white">
                L'installation {data.name} a été créée avec succès !
              </span>
            </div>
          ),
        });
      })
      .catch((error) => {
        toast({
          description: (
            <div className="mt-2 w-auto rounded-md bg-red-600 p-4">
              <span className="text-white">
                L'installation {data.name} n'a pas pu être créée.
              </span>
            </div>
          ),
        });
      });
  }
  return createUser ? (
    <div className="flex flex-col w-full h-[90vh] bg-white items-center justify-center">
      <div className="flex flex-col shadow-slate-500 shadow-md min-w-[80%] lg:min-w-[30%] lg:max-w-[50%] lg:min-h-[80%] bg-white p-10 rounded-md">
        <Button
          variant="ghost"
          className="block w-fill"
          onClick={() => {
            setCreateInstallation(false), setCreateUser(false);
          }}
        >
          <ArrowLeft className="text-primary" />
        </Button>
        <h2 className="text-center mb-8 justify-self-center w-full text-2xl self-center font-semibold text-primary underline">
          Création d'un utilisateur
        </h2>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) =>
              handleSubmitUser(
                data as {
                  email: string;
                  lastname: string;
                  firstname: string;
                  organization: string;
                  role: number;
                }
              )
            )}
            className=""
          >
            <div className="space-y-2 grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-bold text-primary text-lg">
                      Mail
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="ex. personne@organisation.fr"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-bold text-primary text-lg">
                      Nom
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="ex. Smith" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="firstname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-bold text-primary text-lg">
                      Prénom
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="ex. John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="organization"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-bold text-primary text-lg">
                      Entreprise
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "justify-between",
                              !field.value &&
                                "text-muted-foreground text-sm italic"
                            )}
                          >
                            {field.value
                              ? fakeOrganizations.find(
                                  (organization) =>
                                    organization.value === field.value
                                )?.label
                              : "Sélectionner une entreprise"}
                            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="p-0">
                        <Command>
                          <CommandInput
                            placeholder="Chercher une entreprise"
                            className="h-9"
                          />
                          <CommandEmpty>Pas d'entreprise trouvée.</CommandEmpty>
                          <CommandGroup>
                            {fakeOrganizations.map((organization) => (
                              <CommandItem
                                value={organization.label}
                                className="flex items-center justify-between w-full"
                                key={organization.value}
                                onSelect={() => {
                                  form.setValue(
                                    "organization",
                                    organization.value
                                  );
                                }}
                              >
                                <Image
                                  src={organization.logo}
                                  alt={organization.label}
                                  width={80}
                                  height={50}
                                />
                                {organization.label}
                                <CheckIcon
                                  className={cn(
                                    "h-4 w-4",
                                    organization.value === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
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
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-bold text-primary text-lg">
                      Rôle
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "justify-between",
                              !field.value &&
                                "text-muted-foreground text-sm italic"
                            )}
                          >
                            {field.value
                              ? roles.find((role) => role.value === field.value)
                                  ?.label
                              : "Sélectionner un rôle"}
                            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="p-0">
                        <Command>
                          <CommandInput
                            placeholder="Chercher un rôle"
                            className="h-9"
                          />
                          <CommandEmpty>Pas de rôles trouvés.</CommandEmpty>
                          <CommandGroup>
                            {roles.map((role) => (
                              <CommandItem
                                value={role.label}
                                key={role.value}
                                onSelect={() => {
                                  form.setValue("role", role.value);
                                }}
                              >
                                {role.label}
                                <CheckIcon
                                  className={cn(
                                    "ml-auto h-4 w-4",
                                    role.value === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
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
            </div>
            <div className="flex w-full items-center justify-center">
              <AlertDialog>
                <AlertDialogTrigger>
                  <Button
                    type="button"
                    className={cn(
                      "w-[200px] self-center shadow-sm shadow-slate-800"
                    )}
                  >
                    Création de l'utilisateur
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Avez-vous vérifié les informations ?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Il n'y aura pas de retour possible, merci de bien vérifier
                      les informations avant de confirmer.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction
                      type="submit"
                      onClick={() => {
                        setLoading(true);
                        handleSubmitUser(
                          form.getValues() as {
                            email: string;
                            lastname: string;
                            firstname: string;
                            organization: string;
                            role: number;
                          }
                        );
                      }}
                    >
                      Confirmer
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </form>
        </Form>
      </div>
    </div>
  ) : createInstallation ? (
    <div className="flex flex-col w-full h-[90vh] bg-white items-center justify-center">
      <div className="flex flex-col shadow-slate-500 shadow-md min-w-[80%] lg:min-w-[30%] lg:max-w-[50%] bg-white p-10 rounded-md">
        <Button
          variant="ghost"
          className="block w-fill"
          onClick={() => {
            if (step === 1) {
              setCreateInstallation(false), setCreateUser(false);
              setStep(0);
            } else {
              setStep((prev) => prev - 1);
            }
          }}
        >
          <ArrowLeft className="text-primary" />
        </Button>
        <h2 className="text-center mb-8 justify-self-center w-full text-2xl self-center font-semibold text-primary underline">
          Création d'une installation
        </h2>
        {step === 1 && (
          <>
            <h3 className="mb-8 w-full text-primary underline text-md font-semibold">
              Étape 1 - Vérification de l'ID de l'Ewon :
            </h3>

            <Form {...form}>
              <form className="">
                <div className="space-y-2 flex flex-col gap-2">
                  <FormField
                    control={form.control}
                    name="ewonId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-bold text-primary text-lg">
                          EwonId
                        </FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {ewonIdChecked && <span>Ewon Id validé ! ✅</span>}
                  {!ewonIdChecked ? (
                    <Button
                      type="button"
                      className={cn(
                        "w-[200px] self-center shadow-sm shadow-slate-800"
                      )}
                      onClick={() => {
                        checkEwon(form.getValues("ewonId"));
                      }}
                    >
                      {loading ? (
                        <Loader className="animate-spin" />
                      ) : (
                        "Vérifier l'Ewon"
                      )}
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      className={cn(
                        "w-[200px] self-center shadow-sm shadow-slate-800"
                      )}
                      onClick={() => {
                        setStep((prev) => prev + 1);
                      }}
                    >
                      Étape suivante
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </>
        )}
        {step === 2 && (
          <>
            <h3 className="mb-8 w-full text-primary underline text-md font-semibold">
              Étape 2 - Nommez la centrale :
            </h3>

            <Form {...form}>
              <form className="">
                <div className="space-y-2 flex flex-col gap-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <div>
                        <FormItem>
                          <FormLabel className="text-bold text-primary text-lg">
                            Nom
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="ex. Centrale Solstyce Voreppe"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      </div>
                    )}
                  />

                  {nameChecked && <span>Le nom est disponible ! ✅</span>}
                  {!nameChecked ? (
                    <Button
                      type="button"
                      className={cn(
                        "w-[200px] self-center shadow-sm shadow-slate-800"
                      )}
                      onClick={() => {
                        checkName(form.getValues("name"));
                      }}
                    >
                      {loading ? (
                        <Loader className="animate-spin" />
                      ) : (
                        "Vérifier la disponibilité"
                      )}
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      className={cn(
                        "w-[200px] self-center shadow-sm shadow-slate-800"
                      )}
                      onClick={() => {
                        setStep((prev) => prev + 1);
                        console.log(step);
                      }}
                    >
                      Étape suivante
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </>
        )}
        {step === 3 && (
          <>
            <h3 className="mb-8 w-full text-primary underline text-md font-semibold">
              Étape 3 - Ajoutez une adresse à {form.getValues("name")} :
            </h3>

            <Form {...form}>
              <form className="">
                <div className="space-y-2 flex flex-col gap-2">
                  <SearchBox
                    form={form}
                    onSelectAddress={(address, latitude, longitude) => {
                      if (latitude !== null && longitude !== null) {
                        form.setValue("address", address);
                        form.setValue("latitude", latitude);
                        form.setValue("longitude", longitude);
                        setValue("address", address);
                        setValue("latitude", latitude);
                        setValue("longitude", longitude);
                      }
                    }}
                    defaultValue=""
                  />
                  {address ? (
                    <>
                      <GoogleMap
                        zoom={18}
                        center={center}
                        mapContainerClassName={cn(
                          "w-full h-[300px]",
                          !address && "hidden"
                        )}
                      >
                        <Marker
                          draggable={true}
                          onDragEnd={(e) => {
                            if (e.latLng !== null) {
                              form.setValue("latitude", e.latLng.lat());
                              form.setValue("longitude", e.latLng.lng());
                              setValue("latitude", e.latLng.lat());
                              setValue("longitude", e.latLng.lng());
                              console.log(form.getValues());
                            }
                          }}
                          position={center}
                          //   icon={{
                          //     url: "https://e7.pngegg.com/pngimages/702/434/png-clipart-battery-battery.png",
                          //     scaledSize: new window.google.maps.Size(80, 50), // Ajuste la taille ici
                          //   }}
                        />
                      </GoogleMap>
                      <Button
                        type="button"
                        className={cn(
                          "w-[200px] self-center shadow-sm shadow-slate-800"
                        )}
                        onClick={() => {
                          setLoading(true);
                          setStep((prev) => prev + 1);
                          console.log(form.getValues());
                        }}
                      >
                        Étape suivante
                      </Button>
                    </>
                  ) : (
                    ""
                  )}
                </div>
              </form>
            </Form>
          </>
        )}
        {step === 4 && (
          <>
            <h3 className="mb-8 w-full text-primary underline text-md font-semibold">
              Étape 4 - Informations complémentaires :
            </h3>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit((data) =>
                  handleSubmitInstallation(
                    data as {
                      name: string;
                      address: string;
                      latitude: number;
                      longitude: number;
                      ewonId: string;
                      tarifAchat: number;
                      tarifRevente: number;
                    }
                  )
                )}
                className=""
              >
                <div className="items-center flex space-x-2 mb-2">
                  <Checkbox
                    id="terms1"
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setRevente(true);
                      } else {
                        setRevente(false);
                      }
                    }}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="terms1"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Centrale en revente totale
                    </label>
                  </div>
                </div>
                {!revente && (
                  <FormField
                    control={form.control}
                    name="tarifAchat"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-bold text-primary text-lg">
                          Tarif de l'électricité à l'achat
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            onChange={(e) => {
                              const value = parseFloat(e.target.value);
                              field.onChange(value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <FormField
                  control={form.control}
                  name="tarifRevente"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-bold text-primary text-lg">
                        Tarif de l'électricité à la revente
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          onChange={(e) => {
                            const value = parseFloat(e.target.value);
                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="space-y-2 flex flex-col gap-2">
                  <Button
                    type="submit"
                    className={cn(
                      "w-[200px] self-center shadow-sm shadow-slate-800"
                    )}
                    onClick={() => {
                      setLoading(true);
                      setStep((prev) => prev + 1);
                      console.log(form.getValues());
                    }}
                  >
                    Étape suivante
                  </Button>
                </div>
              </form>
            </Form>
          </>
        )}
        {step === 5 && (
          <>
            <h3 className="mb-8 w-full text-primary underline text-md font-semibold">
              Étape 5 - Vérifiez les informations :
            </h3>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit((data) =>
                  handleSubmitInstallation(
                    data as {
                      name: string;
                      address: string;
                      latitude: number;
                      longitude: number;
                      ewonId: string;
                      tarifAchat: number;
                      tarifRevente: number;
                    }
                  )
                )}
                className=""
              >
                <h4 className="flex text-primary font-semibold mb-1">
                  Ewon ID de la centrale :
                </h4>
                <p className="mb-4">{form.getValues("ewonId")}</p>
                <h4 className="flex text-primary font-semibold mb-1">
                  Nom de la centrale :
                </h4>
                <p className="mb-4">{form.getValues("name")}</p>
                <h4 className="flex text-primary font-semibold mb-1">
                  Adresse de la centrale :
                </h4>
                <p className="capitalize mb-4">{form.getValues("address")}</p>
                <h4 className="flex text-primary font-semibold mb-1">
                  Localisation de la centrale :
                </h4>
                <p className="capitalize mb-4">
                  Latitude : {form.getValues("latitude")} <br />
                  Longitude : {form.getValues("longitude")}
                </p>
                <p className="capitalize mb-4">
                  {!revente
                    ? `
                  Tarif d'achat : ${form.getValues("tarifAchat")} € 
                  `
                    : ""}
                  <br />
                  Tarif de revente : {form.getValues("tarifRevente")} €
                </p>
                <div className="space-y-2 flex flex-col gap-2">
                  <AlertDialog>
                    <AlertDialogTrigger>
                      <Button
                        className={cn(
                          "w-[200px] self-center shadow-sm shadow-slate-800"
                        )}
                      >
                        Création de la centrale
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Avez-vous vérifié les informations ?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Il n'y aura pas de retour possible, merci de bien
                          vérifier les informations avant de confirmer.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                          type="submit"
                          onClick={() => {
                            setLoading(true);
                            if (!revente) {
                              form.setValue("tarifAchat", 0);
                            }
                            handleSubmitInstallation(
                              form.getValues() as {
                                name: string;
                                address: string;
                                latitude: number;
                                longitude: number;
                                ewonId: string;
                                tarifAchat: number;
                                tarifRevente: number;
                              }
                            );
                          }}
                        >
                          Confirmer
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </form>
            </Form>
          </>
        )}
      </div>
    </div>
  ) : (
    <div className="flex flex-col w-full h-[90vh] bg-white items-center justify-center">
      <div className="flex flex-col shadow-slate-500 shadow-md min-w-[80%] lg:min-w-[30%] lg:max-w-[50%] bg-white p-10 rounded-md">
        <h2 className="text-center mb-8 justify-self-center w-full text-2xl self-center font-semibold text-primary underline">
          Que souhaitez-vous créer ?
        </h2>
        <Button
          className="w-[200px] self-center mb-4 shadow-sm shadow-slate-800"
          onClick={() => setCreateUser(true)}
        >
          Un utilisateur
        </Button>
        <Button
          className="w-[200px] self-center shadow-sm shadow-slate-800"
          onClick={() => {
            setCreateInstallation(true), setStep(1);
          }}
        >
          Une centrale
        </Button>
      </div>
    </div>
  );
};

export default Create;
