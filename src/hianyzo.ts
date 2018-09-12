/** Egy hiányzó tanulót leíró osztály */
export class Hianyzo {
  public Név: string;
  private Hónap: number;
  private Nap: number;
  private Mulasztások: string; // A napi hiányzást leíró mita O, I, X és N

  /**
   * Az osztály konstruktora
   * @constructor
   * @param {string} dátumSor - A forrás file dátumot kódoló sora
   * @param {string} sor - A forrás file egy hiányzót kódoló sora
   */
  public constructor(dátumSor: string, sor: string) {
    let m: string[] = dátumSor.split(" ");
    if (m.length !== 3) throw new Error("Hibás forrás!");
    this.Hónap = parseInt(m[1]);
    if (Number.isNaN(this.Hónap)) throw new Error("Hibás forrás!");
    this.Nap = parseInt(m[2]);
    if (Number.isNaN(this.Nap)) throw new Error("Hibás forrás!");

    m = sor.split(" ");
    if (m.length !== 3) throw new Error("Hibás forrás!");
    this.Név = `${m[0]} ${m[1]}`;
    this.Mulasztások = m[2];
  }

  /** 4. feladat megoldása */
  public static HetNapja(honap: number, nap: number): string {
    // prettier-ignore
    const napnev: string[] = ["vasarnap", "hetfo", "kedd", "szerda", "csutortok", "pentek", "szombat"];
    // prettier-ignore
    const napszam: number[] = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 335];

    const napsorszam: number = (napszam[honap - 1] + nap) % 7;
    return napnev[napsorszam];
  }

  /** Igazolt hiányzások száma */
  public get IgazoltDb(): number {
    return this.Megszámol("X");
  }

  /** Igazolatlan hiányzások száma */
  public get IgazolatlanDb(): number {
    return this.Megszámol("I");
  }

  /** Hiányzások száma */
  public get HianyzasDb(): number {
    return this.IgazoltDb + this.IgazolatlanDb;
  }

  /** Megadott karakter darabszáma a mulasztások karakterláncban
   * @param {string} ch - A megszámlálandó karakter (hiányzás típus)
   */
  private Megszámol(ch: string): number {
    let darab: number = 0;
    for (let i: number = 0; i < this.Mulasztások.length; i++) {
      if (this.Mulasztások[i] === ch) darab++;
    }
    return darab;
  }

  public MegszámolHiányzás(nap: string, óra: number): number {
    let darab: number = 0;
    óra--;
    // prettier-ignore
    if (nap === Hianyzo.HetNapja(this.Hónap, this.Nap) &&
          (this.Mulasztások[óra] === "X" || this.Mulasztások[óra] === "I")) {
      darab++;
    }
    return darab;
  }
}
