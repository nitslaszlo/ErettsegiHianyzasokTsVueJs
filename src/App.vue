<template>
  <div id="app">
    <p>
      Linkek:
      <a href="naplo.txt" download>naplo.txt</a>
      <a href="Hianyzasok_fel.pdf" target="_blank">Feladat</a>
      <a href="Hianyzasok_jav.pdf" target="_blank">Javítási</a>
      <a href="https://github.com/nitslaszlo/ErettsegiHianyzasokTsVueJs" target="_blank">Forrás</a>
      <a href="https://github.com/nitslaszlo/JedlikVueJsStarter" target="_blank">SDK</a>
    </p>
    <txt-reader title="Kérem töltse fel a forrás (naplo.txt) állományt!" @load="txtSorai = $event"/>
    <div v-show="mutat" id="megoldás">
      <p>1. feladat:
        <br>Az adatok beolvasása
      </p>
      <p>2. feladat:
        <br>
        A naplóban {{ hiányzók.length }} bejegyzés van.
      </p>
      <p>
        3. feladat:
        <br>
        Az igazolt hiányzások száma {{ összIgazolt }}, az igazolatlanoké
        {{ összIgazolatlan }} óra.
      </p>
      <p>
        5. feladat:
        <br>A hónap sorszáma =
        <input v-model="hónap" type="number" min="1" max="12" placeholder="1-12">
        <br>A nap sorszáma =
        <input v-model="nap" type="number" min="1" max="31" placeholder="1-31">
      </p>
      <p>Azon a napon {{ napNeveVolt }} volt.</p>
      <p>
        6. feladat:
        <br>A nap neve =
        <input v-model="napNeveInput" type="text" placeholder="Ékezetek nélkül!">
        <br>Az óra sorszáma =
        <input
          v-model="óraSorszám"
          type="number"
          min="1"
          max="24"
          placeholder="1-24"
        >
      </p>
      <p>Ekkor összesen {{ hiányzásokDb }} óra hiányzás történt.</p>
      <p>
        7.feladat:
        <br>A legtöbbet hiányzó tanulók:
        <span v-for="t in legtöbbetHiányzók" :key="t">{{ t + " " }}</span>
      </p>
    </div>
    <!-- Megoldás DIV -->
    <!-- Nem a feladat része : -->
    <p v-show="mutat">
      <b>naplo.txt fájl:</b>
    </p>
    <span v-for="(t, index) in txtSorai.split('\n')" :key="index">
      {{ t.trim() }}
      <br>
    </span>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import Hiányzó from "./hiányzó";
import TxtReader from "./components/TxtReader.vue";

// eslint-disable-next-line
@Component({ components: { TxtReader } })
export default class App extends Vue {
  private hiányzók: Hiányzó[] = [];
  private txtSorai: string = ""; // Watch végett nem lehet ékezetes azonosító! (pl.: forrás)!
  private mutat: boolean = false;
  private hónap: number = 2;
  private nap: number = 3;
  private napNeveInput: string = "szerda";
  private óraSorszám: number = 3;

  @Watch("txtSorai", { immediate: true, deep: true })
  private haForrásVáltozik(val: string, oldVal: string) {
    if (val !== "") this.feldolgoz();
  }

  private feldolgoz(): void {
    try {
      let aktDátum: string = "";
      this.txtSorai.split("\n").forEach(i => {
        const aktSor: string = i.trim();
        if (aktSor[0] === "#") aktDátum = aktSor;
        else if (aktSor.length > 0) this.hiányzók.push(new Hiányzó(aktDátum, aktSor));
      });
      this.mutat = true;
    } catch (error) {
      this.mutat = false;
      this.hiányzók = [];
      this.txtSorai = "";
      window.alert("Hibás forrás!");
    }
  }

  // 3. feladat
  private get összIgazolt(): number {
    let összIgazolt: number = 0;
    this.hiányzók.forEach(i => {
      összIgazolt += i.igazoltDb;
    });
    return összIgazolt;
  }

  // 3. feladat
  private get összIgazolatlan(): number {
    let összIgazolatlan: number = 0;
    this.hiányzók.forEach(i => {
      összIgazolatlan += i.igazolatlanDb;
    });
    return összIgazolatlan;
  }

  // 5. feladat
  private get napNeveVolt(): string {
    return Hiányzó.hétNapja(this.hónap, this.nap);
  }

  // 6. feladat
  private get hiányzásokDb(): number {
    let db: number = 0;
    this.hiányzók.forEach(i => {
      db += i.megszámolHiányzás(this.napNeveInput, this.óraSorszám);
    });
    return db;
  }

  // 7. feladat
  private get legtöbbetHiányzók(): string[] {
    const stat: Map<string, number> = new Map<string, number>();
    this.hiányzók.forEach(i => {
      if (stat.has(i.név)) stat.set(i.név, stat.get(i.név)! + i.hiányzásDb);
      else stat.set(i.név, i.hiányzásDb);
    });

    const maxHiányzás: number = Math.max(...stat.values());
    const tanulók: string[] = [];
    stat.forEach((value: number, key: string) => {
      if (value === maxHiányzás) tanulók.push(key);
    });
    return tanulók;
  }
}
</script>

<style>
#app {
  font-family: Courier;
}
#megoldás {
  background-color: lightgrey;
}
a {
  text-decoration: none;
  padding-left: 10px;
}
</style>
