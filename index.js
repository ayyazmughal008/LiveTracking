/**
 * @format
 */
 import ReactNativeForegroundService from '@supersami/rn-foreground-service';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
// Register the service
ReactNativeForegroundService.register();
AppRegistry.registerComponent(appName, () => App);
