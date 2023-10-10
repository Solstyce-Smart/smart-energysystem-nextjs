import getEwon from "../fakeDatas/getEwon.json";

export default function Home() {
  const validTags: any = [];
  getEwon.tags.map((data) => {
    if (data.ewonTagId === -1) {
      return;
    }
    return validTags.push(data);
  });

  return (
    <main className="bg-primary flex min-h-[90vh] h-full w-full flex-col p-6">
      {validTags.map((data: { name: string; value: number }) => {
        return (
          <p key={data.name} className="text-red-500 text-sm">
            Nom : {data.name} --- Valeur : {+data.value.toFixed(1)}
          </p>
        );
      })}
    </main>
  );
}
