import algeriaData from "./data/algeria.json";

type Commune = {
  code?: string | number;
  ascii?: string;
  arabic?: string;
  name?: string;
};

type WilayaData = {
  code: string | number;
  ascii?: string;
  arabic?: string;
  name?: string;
  communes?: Commune[];
};

const data = algeriaData as WilayaData[];

function getWilayaName(wilaya: WilayaData): string {
  return (
    wilaya.ascii ||
    wilaya.name ||
    wilaya.arabic ||
    ""
  );
}

function getCommuneName(commune: Commune): string {
  return (
    commune.ascii ||
    commune.name ||
    commune.arabic ||
    ""
  );
}

export function getWilayas() {
  return data
    .map((wilaya) => ({
      code: String(wilaya.code),
      name: getWilayaName(wilaya),
      nameAr: wilaya.arabic || "",
    }))
    .filter((wilaya) => wilaya.name)
    .sort(
      (a, b) =>
        Number(a.code) - Number(b.code)
    );
}

export function getBaladias(
  wilayaName: string
): string[] {
  const requested = String(
    wilayaName || ""
  )
    .trim()
    .toLowerCase();

  if (!requested) {
    return [];
  }

  const wilaya = data.find(
    (item) =>
      getWilayaName(item).toLowerCase() ===
      requested
  );

  if (!wilaya) {
    return [];
  }

  return (wilaya.communes || [])
    .map(getCommuneName)
    .filter(Boolean)
    .sort((a, b) =>
      a.localeCompare(b)
    );
}

export function isValidWilaya(
  value: unknown
): boolean {
  if (typeof value !== "string") {
    return false;
  }

  const requested = value
    .trim()
    .toLowerCase();

  return getWilayas().some(
    (wilaya) =>
      wilaya.name.toLowerCase() ===
      requested
  );
}

export function isValidBaladia(
  wilayaName: string,
  baladia: string
): boolean {
  const requested = String(
    baladia || ""
  )
    .trim()
    .toLowerCase();

  if (!requested) {
    return false;
  }

  return getBaladias(wilayaName).some(
    (item) =>
      item.toLowerCase() === requested
  );
}