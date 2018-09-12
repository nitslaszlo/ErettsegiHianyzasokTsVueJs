<template>
  <div id="app">
    <p>
      Linkek: <a href="naplo.txt" download>naplo.txt   </a>
      <a href="Hianyzasok_fel.pdf" target="_blank">Feladat   </a>
      <a href="Hianyzasok_jav.pdf" target="_blank">Javítási  </a>
      <a href="https://github.com/nitslaszlo/ErettsegiHianyzasokTsVueJs" target="_blank">Forrás </a>
      <a href="https://github.com/nitslaszlo/JedlikVueJsStarter" target="_blank">SDK</a>
    </p>
    <txt-olvaso v-on:load="forras = $event" title="Kérem töltse fel a forrás (naplo.txt) állományt!" />
    <div id="megoldas" v-show="mutat">
      <p>1. feladat:<br>Az adatok beolvasása</p>
      <p>2. feladat:<br>A naplóban {{hianyzok.length}} bejegyzés van.</p>
      <p>3. feladat:<br>Az igazolt hiányzások száma {{OsszIgazolt}}, az igazolatlanoké {{OsszIgazolatlan}} óra.</p>
      <p>5. feladat:<br>
        A hónap sorszáma =  <input type="number" v-model="honap" min="1" max="12" placeholder="1-12"/><br>
        A nap sorszáma =  <input type="number" v-model="nap" min="1" max="31" placeholder="1-31" /></p>
      <p>Azon a napon {{NapNeve}} volt.</p>
      <p>6. feladat:<br>
        A nap neve =  <input type="text" v-model="napNeve" /><br>
        Az óra sorszáma =  <input type="number" v-model="oraSorszam" min="1" max="24" placeholder="1-24" /></p>
      <p>Ekkor összesen {{HianyzasokDb}} óra hiányzás történt.</p>
      <p>7.feladat:<br>A legtöbbet hiányzó tanulók: <span v-for="t in LegtobbetHianyzok" :key="t">{{t}} </span> </p>
    </div>
    <!-- Nem a feladat része : -->
      <p v-show="mutat"><b>naplo.txt fájl:</b></p>
      <span v-for="(t, index) in forras.split('\n')" :key="index">{{t.trim()}}<br></span>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { Hianyzo } from "./hianyzo";
import TxtOlvaso from "./components/TxtOlvaso.vue";

// eslint-disable-next-line
@Component({ components: { TxtOlvaso } })
export default class App extends Vue {
  private hianyzok: Hianyzo[] = [];
  private aktDatum: string = "";
  private forras: string = "";
  private mutat: boolean = false;
  private honap: number = 2;
  private nap: number = 3;
  private napNeve: string = "szerda";
  private oraSorszam: number = 3;

  @Watch("forras", { immediate: true, deep: true })
  onForrasChanged(val: string, oldVal: string) {
    if (val != "") {
      this.Feldolgoz();
    }
  }

  private Feldolgoz(): void {
    try {
      this.forras.split("\n").forEach(i => {
        const aktSor: string = i.trim();
        if (aktSor[0] === "#") this.aktDatum = aktSor;
        else if (aktSor.length > 0)
          this.hianyzok.push(new Hianyzo(this.aktDatum, aktSor));
      });
      this.mutat = true;
    } catch (error) {
      this.mutat = false;
      this.hianyzok = [];
      this.forras = "";
      window.alert("Hibás forrás!");
    }
  }

  // 3. feladat
  private get OsszIgazolt(): number {
    let osszIgazolt: number = 0;
    this.hianyzok.forEach(i => {
      osszIgazolt += i.IgazoltDb;
    });
    return osszIgazolt;
  }

  // 3. feladat
  private get OsszIgazolatlan(): number {
    let osszIgazolatlan: number = 0;
    this.hianyzok.forEach(i => {
      osszIgazolatlan += i.IgazolatlanDb;
    });
    return osszIgazolatlan;
  }

  // 5. feladat
  private get NapNeve(): string {
    return Hianyzo.HetNapja(this.honap, this.nap);
  }

  // 6. feladat
  private get HianyzasokDb(): number {
    let db: number = 0;
    this.hianyzok.forEach(i => {
      db += i.MegszámolHiányzás(this.napNeve, this.oraSorszam);
    });
    return db;
  }

  // 7. feladat
  private get LegtobbetHianyzok(): string[] {
    const stat: Map<string, number> = new Map<string, number>();
    this.hianyzok.forEach(i => {
      if (stat.has(i.Név)) {
        stat.set(i.Név, stat.get(i.Név)! + i.HianyzasDb);
      } else {
        stat.set(i.Név, i.HianyzasDb);
      }
    });

    const maxHianyzas: number = Math.max(...stat.values());
    let tanulok: string[] = [];
    stat.forEach((value: number, key: string) => {
      if (value === maxHianyzas) tanulok.push(key);
    });
    return tanulok;
  }
}
</script>

<style>
#app {
  font-family: Courier;
}
#megoldas {
  background-color: lightgrey;
}
a {
  text-decoration: none;
}
</style>
