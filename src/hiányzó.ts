// Megjegyzések stílusa: JSDoc 3 -> http://usejsdoc.org/

/** Egy hiányzó tanulót leíró osztály */
export default class Hiányzó {
  /** 4. feladat megoldása - függvény kódolása (javított azonosítókkal) */
  public static hétNapja(hónap: number, nap: number): string {
    const napNév: string[] = ["vasarnap", "hetfo", "kedd", "szerda", "csutortok", "pentek", "szombat"];
    const napSzám: number[] = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 335];

    const napSorszám: number = (napSzám[hónap - 1] + nap) % 7;
    return napNév[napSorszám];
  }

  public név: string;
  private hónap: number;
  private nap: number;
  private mulasztások: string; // A napi hiányzást leíró mita O, I, X és N

  /** Az osztály konstruktora
   * @constructor
   * @param {string} dátumSor A forrás file dátumot kódoló sora
   * @param {string} hiányzásSor A forrás file egy hiányzót kódoló sora
   */
  public constructor(dátumSor: string, hiányzásSor: string) {
    let m: string[] = dátumSor.split(" ");
    if (m.length !== 3) throw new Error("Hibás forrás!");
    this.hónap = parseInt(m[1], 10);
    if (Number.isNaN(this.hónap)) throw new Error("Hibás forrás!");
    this.nap = parseInt(m[2], 10);
    if (Number.isNaN(this.nap)) throw new Error("Hibás forrás!");

    m = hiányzásSor.split(" ");
    if (m.length !== 3) throw new Error("Hibás forrás!");
    this.név = `${m[0]} ${m[1]}`;
    this.mulasztások = m[2];
  }

  /** Meghatározza a megadott nap (pl.: hetfo) megadott tanórájában (pl.: 1) a hiányzások összegét
   * @param {string} napNeve A nap neve (pl.: csutortok)
   * @param {number} sorszámTanóra A tanóra sorszáma (1..N)
   */
  public megszámolHiányzás(napNeve: string, sorszámTanóra: number): number {
    sorszámTanóra--;
    if (napNeve === Hiányzó.hétNapja(this.hónap, this.nap) &&
      (this.mulasztások[sorszámTanóra] === "X" || this.mulasztások[sorszámTanóra] === "I")) {
      return 1; // Hiányzot a megadott nap (pl. "kedd") megadott tanórájában (pl. 2)
    }
    return 0; // Nem a megadott nap (pl. "kedd") megadott tanórájában (pl. 2) hányzott
  }

  /** Igazolt hiányzások száma */
  public get igazoltDb(): number {
    return this.megszámol("X");
  }

  /** Igazolatlan hiányzások száma */
  public get igazolatlanDb(): number {
    return this.megszámol("I");
  }

  /** Hiányzások száma */
  public get hiányzásDb(): number {
    return this.igazoltDb + this.igazolatlanDb;
  }

  /** Megadott karakter darabszáma a mulasztások karakterláncban
   * @param {string} ch A megszámlálandó karakter (hiányzás típus)
   */
  private megszámol(ch: string): number {
    let darab: number = 0;
    for (const i of this.mulasztások) {
      if (i === ch) darab++;
    }
    return darab;
  }
}
