/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Api from './src/Api';
import List from './src/APITesting/List';
import MapList from './src/APITesting/MapList';


function App() {
  const Stack = createNativeStackNavigator()

  return (
<NavigationContainer>    
<Stack.Navigator initialRouteName='Api' screenOptions={{headerShown : false}}>
<Stack.Screen name='Api' component={Api} />
<Stack.Screen name='mapList' component={MapList}/>
<Stack.Screen name='List' component={List}/>
</Stack.Navigator>
  </NavigationContainer>
);
}

export default App;
