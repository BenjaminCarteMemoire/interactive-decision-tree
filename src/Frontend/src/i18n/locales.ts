import { fr_FR } from "./fr_fr";
import { en_US } from "./en_us";
import type { MSG } from "./interface-msg";

export type Locale = "en_US" | "fr_FR";
let IDT_Locale: Locale = IDT_TREE['_internal']['locale'] ?? "en_US";

const LOCALE_TABLE: Record<Locale, MSG> = {
    en_US: en_US,
    fr_FR: fr_FR
}

export const $: MSG = { ...LOCALE_TABLE[IDT_Locale] };
export function IDT_set_locale( locale: Locale ){

    IDT_Locale = locale;
    Object.assign( $, LOCALE_TABLE[ IDT_Locale ] );

}