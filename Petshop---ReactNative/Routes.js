import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
const AppStack = createStackNavigator();

// Importing the page components for the app
import Home from './Pages/Clientes';
import Form from './Pages/ChooseTheAnimal';
import Auth from './Pages/Auth';
import CriarConta from './Pages/CriarConta';
import ChooseTheProcedure from './Pages/ChooseTheProcedure'; 
import ConfirmationPage from './Pages/ConfirmationPage'; 

// Defining the routes through an arrow function
const Routes = () => {
  return (
    <NavigationContainer>
      <AppStack.Navigator screenOptions={{ headerShown: false, animationEnabled: true }}>
        <AppStack.Screen name="Auth" component={Auth} />
        <AppStack.Screen name="CriarConta" component={CriarConta} />
        <AppStack.Screen name="ChooseTheAnimal" component={Form} /> 
        <AppStack.Screen name="ChooseTheProcedure" component={ChooseTheProcedure} /> 
        <AppStack.Screen name="ConfirmationPage" component={ConfirmationPage} /> 
        <AppStack.Screen name="Clientes" component={Home} />
      </AppStack.Navigator>
    </NavigationContainer>
  );
}

export default Routes;
