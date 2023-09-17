import { WritableSignal } from '@angular/core';
import * as core from '@lib/stats';
import { PokemonState, comparePokemonState, createPokemonState } from './models/pokemon-state';
import { Pokemon } from '@lacolaco/pokemon-data';

export function maximizeStat($pokemon: WritableSignal<PokemonState>, key: core.StatKey) {
  const { evs } = $pokemon();
  const free = core.MAX_EV_TOTAL - core.sumOfStatValues(evs);
  const max = Math.min(evs[key] + free, core.MAX_EV_VALUE);
  $pokemon.update((state) => ({
    ...state,
    evs: { ...state.evs, [key]: core.asEV(max) },
  }));
}

export function minimizeStat($pokemon: WritableSignal<PokemonState>, key: core.StatKey) {
  $pokemon.update((state) => ({
    ...state,
    evs: { ...state.evs, [key]: core.asEV(0) },
  }));
}

export function incrementStat($pokemon: WritableSignal<PokemonState>, key: core.StatKey) {
  const { pokemon, level, nature, ivs, evs } = $pokemon();
  const iv = ivs[key];
  if (iv === null) {
    return;
  }
  const base = core.asStat(pokemon.baseStats[key]);
  const newEV =
    key === 'H'
      ? core.calculateIncrementedEVForHP(base, level, iv, evs[key])
      : core.calculateIncrementedEVForNonHP(base, level, iv, evs[key], nature.values[key]);
  $pokemon.update((state) => ({
    ...state,
    evs: { ...state.evs, [key]: newEV },
  }));
}

export function decrementStat($pokemon: WritableSignal<PokemonState>, key: core.StatKey) {
  const { pokemon, level, nature, ivs, evs } = $pokemon();
  const iv = ivs[key];
  if (iv === null) {
    return;
  }
  const base = core.asStat(pokemon.baseStats[key]);
  const newEV =
    key === 'H'
      ? core.calculateDecrementedEVForHP(base, level, iv, evs[key])
      : core.calculateDecrementedEVForNonHP(base, level, iv, evs[key], nature.values[key]);
  $pokemon.update((state) => ({
    ...state,
    evs: { ...state.evs, [key]: newEV },
  }));
}

export function toggleIgnored($pokemon: WritableSignal<PokemonState>, key: core.StatKey) {
  const { ivs, evs } = $pokemon();
  const isIgnored = ivs[key] === null;
  $pokemon.update((state) => ({
    ...state,
    ivs: { ...ivs, [key]: isIgnored ? core.asStat(31) : null },
    evs: { ...evs, [key]: core.asStat(0) },
  }));
}

export function changePokemon($pokemon: WritableSignal<PokemonState>, pokemon: Pokemon) {
  const current = $pokemon();
  if (current.pokemon === pokemon) {
    return;
  }
  $pokemon.set(createPokemonState(pokemon));
}

export function updatePokemonState($pokemon: WritableSignal<PokemonState>, input: Partial<PokemonState>) {
  const current = $pokemon();
  const updated = { ...current, ...input };
  if (comparePokemonState(current, updated)) {
    return;
  }
  $pokemon.set(updated);
}

export function updatePokemonStateByStats(
  $pokemon: WritableSignal<PokemonState>,
  stats: core.StatValues<core.Stat | null>,
) {
  const { pokemon, level, ivs, evs, nature } = $pokemon();
  const newEVs = core.calculateAllEVs(pokemon.baseStats as core.StatValues<core.Stat>, level, ivs, stats, nature);
  if (core.compareStatValues(evs, newEVs)) {
    return;
  }
  $pokemon.update((state) => ({ ...state, evs: newEVs }));
}

export function resetEVs($pokemon: WritableSignal<PokemonState>) {
  $pokemon.update((state) => ({
    ...state,
    evs: { H: core.asEV(0), A: core.asEV(0), B: core.asEV(0), C: core.asEV(0), D: core.asEV(0), S: core.asEV(0) },
  }));
}

export function optimizeDefenseEVs($pokemon: WritableSignal<PokemonState>) {
  const { pokemon, level, nature, ivs, evs } = $pokemon();
  const newEVs = core.optimizeDefenseEVs(pokemon.baseStats as core.StatValues<core.Stat>, level, ivs, evs, nature);
  $pokemon.update((state) => ({ ...state, evs: newEVs }));
}
