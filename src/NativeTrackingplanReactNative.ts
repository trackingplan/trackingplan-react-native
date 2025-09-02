import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  updateTags(tags: { [key: string]: string }): void;
}

export default TurboModuleRegistry.getEnforcing<Spec>(
  'TrackingplanReactNative'
);
