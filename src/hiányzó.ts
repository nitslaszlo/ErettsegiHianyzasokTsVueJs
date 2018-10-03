// Megjegyzések stílusa: JSDoc 3 -> http://usejsdoc.org/

/** Egy hiányzó tanulót leíró osztály */
export default class Hiányzó {
  public Név: string;
  private Hónap: number;
  private Nap: number;
  private Mulasztások: string; // A napi hiányzást leíró mita O, I, X és N

  /**
   * Az osztály konstruktora
   * @constructor
   * @param {string} dátumSor A forrás file dátumot kódoló sora
   * @param {string} hiányzásSor A forrás file egy hiányzót kódoló sora
   */
  public constructor(dátumSor: string, hiányzásSor: string) {
    let m: string[] = dátumSor.split(" ");
    if (m.length !== 3) throw new Error("Hibás forrás!");
    this.Hónap = parseInt(m[1]);
    if (Number.isNaN(this.Hónap)) throw new Error("Hibás forrás!");
    this.Nap = parseInt(m[2]);
    if (Number.isNaN(this.Nap)) throw new Error("Hibás forrás!");

    m = hiányzásSor.split(" ");
    if (m.length !== 3) throw new Error("Hibás forrás!");
    this.Név = `${m[0]} ${m[1]}`;
    this.Mulasztások = m[2];
  }

  /** 4. feladat megoldása - függvény kódolása (javított azonosítókkal) */
  public static HétNapja(hónap: number, nap: number): string {
    // prettier-ignore
    const napNév: string[] = ["vasarnap", "hetfo", "kedd", "szerda", "csutortok", "pentek", "szombat"];
    // prettier-ignore
    const napSzám: number[] = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 335];

    const napSorszám: number = (napSzám[hónap - 1] + nap) % 7;
    return napNév[napSorszám];
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
  public get HiányzásDb(): number {
    return this.IgazoltDb + this.IgazolatlanDb;
  }

  /** Megadott karakter darabszáma a mulasztások karakterláncban
   * @param {string} ch A megszámlálandó karakter (hiányzás típus)
   */
  private Megszámol(ch: string): number {
    let darab: number = 0;
    for (let i: number = 0; i < this.Mulasztások.length; i++) {
      if (this.Mulasztások[i] === ch) darab++;
    }
    return darab;
  }

  /** Meghatároza a megadott nap (pl.: hetfo) megadott tanórájában (pl.: 1) a hiányzások összegét
   * @param {string} napNeve A nap neve (pl.: csutortok)
   * @param {number} sorszámTanóra A tanóra sorszáma (1..N)
   */
  public MegszámolHiányzás(napNeve: string, sorszámTanóra: number): number {
    let darab: number = 0;
    sorszámTanóra--;
    // prettier-ignore
    if (napNeve === Hiányzó.HétNapja(this.Hónap, this.Nap) &&
          (this.Mulasztások[sorszámTanóra] === "X" || this.Mulasztások[sorszámTanóra] === "I")) {
      darab++;
    }
    return darab;
  }
}
