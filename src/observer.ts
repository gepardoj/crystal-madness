import type { Crystal } from "@/model/model";
import type { Vector2 } from "three";

export type EventMap = {
  "crystals_matched": [readonly Crystal[][]],
  "crystal_falling": ["old" | Crystal, number, number, number, number];
  "crystals_swap": [number, number, number, number, Vector2];
};

export class Observer {
  private static _subscriptions: [keyof EventMap, (...params: any) => void][] = [];

  static subscribe<K extends keyof EventMap>(
    type: K,
    listener: (...params: EventMap[K]) => void) {
    this._subscriptions.push([type, listener]);
  }

  static unsubscribe(listener: () => void) {
    this._subscriptions = this._subscriptions.filter(([, lis]) => lis !== listener);
  }

  static notify<K extends keyof EventMap>(
    type: K,
    ...params: EventMap[K]) {
    this._subscriptions.filter(([t]) => t === type).forEach(([, lis]) => lis(...params));
  }
}