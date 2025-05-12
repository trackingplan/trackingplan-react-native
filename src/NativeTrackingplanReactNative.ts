import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  // Empty deliberately
}

export default TurboModuleRegistry.getEnforcing<Spec>(
  'TrackingplanReactNative'
);
