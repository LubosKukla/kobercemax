<template>
  <section class="bg-white py-16">
    <div class="mx-auto max-w-6xl px-4 sm:px-6">
      <BaseHeaderOnlyTitle title="KONTAKT" />
    </div>

    <div class="mx-auto max-w-6xl px-4 sm:px-6 mt-10 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
      <div class="relative overflow-hidden rounded-3xl border border-black/10 shadow-[0_16px_36px_rgba(0,0,0,0.1)]">
        <iframe
          class="h-[360px] w-full md:h-[520px]"
          :src="mapSrc"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          allowfullscreen
          title="Koberce Max, s.r.o. - mapa"
        ></iframe>
        <div class="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center">
          <BaseButton
            class="pointer-events-auto"
            variant="primary"
            :href="mapsLink"
            target="_blank"
            rel="noopener noreferrer"
          >
            zobraziť v mapách
          </BaseButton>
        </div>
      </div>

      <div class="flex flex-col gap-4">
        <div class="rounded-2xl bg-brand p-5 sm:p-6 text-white ">
          <div class="flex items-center gap-3 text-sm font-semibold">
            <font-awesome-icon :icon="['fas', 'envelope']" />
            <span>Email</span>
          </div>
          <p class="mt-2 text-sm sm:text-base">kobercemax@kobercemax.sk</p>
        </div>

        <div class="rounded-2xl bg-light p-5 sm:p-6 text-dark">
          <div class="flex items-center gap-3 text-sm font-semibold">
            <font-awesome-icon :icon="['fas', 'phone']" />
            <span>Mobil</span>
          </div>
          <p class="mt-2 text-sm sm:text-base">044 / 4323884</p>
        </div>

        <div class="rounded-2xl bg-light p-5 sm:p-6 text-dark">
          <div class="flex items-center gap-3 text-sm font-semibold">
            <font-awesome-icon :icon="['fas', 'location-dot']" />
            <span>Adresa</span>
          </div>
          <p class="mt-2 text-sm sm:text-base">Plavisko 7, 034 01 Ružomberok</p>
        </div>

        <div class="rounded-2xl bg-light p-5 sm:p-6 text-dark">
          <div class="flex items-center gap-3 text-sm font-semibold">
            <font-awesome-icon :icon="['fas', 'clock']" />
            <span>OTVÁRACIE HODINY</span>
          </div>
          <p class="mt-2 text-sm sm:text-base">Po. – Pia.: 08:00 – 18:00</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import BaseHeaderOnlyTitle from "@/components/commons/section/BaseHeaderOnlyTitle.vue";
import BaseButton from "@/components/commons/button/BaseButton.vue";

export default {
  name: "ContactTop",
  components: {
    BaseHeaderOnlyTitle,
    BaseButton,
  },
  data() {
    const query = "Koberce Max, s.r.o., Plavisko 7, Ružomberok";
    const encoded = encodeURIComponent(query);

    return {
      mapSrc: `https://www.google.com/maps?q=${encoded}&output=embed`,
      mapsLink: `https://www.google.com/maps/search/?api=1&query=${encoded}`,
    };
  },
};
</script>
