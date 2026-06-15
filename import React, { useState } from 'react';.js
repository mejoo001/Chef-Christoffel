import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';

import { Picker } from '@react-native-picker/picker';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

function HomeScreen({ navigation, menuItems }) {
  // ✅ Calculate average price
  const averagePrice =
    menuItems.length > 0
      ? (menuItems.reduce((sum, item) => sum + item.price, 0) / menuItems.length).toFixed(2)
      : 0;

  return (
    <ScrollView style={styles.container}>

      <Text style={styles.title}>
        Chef's Special Menu
      </Text>

      <Text style={styles.subtitle}>
        Total Items: {menuItems.length}
      </Text>

      {/* ✅ Show average price */}
      <Text style={styles.subtitle}>
        Average Price: R{averagePrice}
      </Text>

      {['Starters', 'Main', 'Dessert'].map(section => (
        <View key={section}>
          <Text style={styles.sectionTitle}>
            {section}
          </Text>

          {menuItems
            .filter(item => item.course === section)
            .map(item => (
              <View key={item.id} style={styles.item}>
                <Text style={styles.itemText}>
                  {item.dishName}
                </Text>

                <Text>{item.description}</Text>
                <Text>R{item.price}</Text>
              </View>
            ))}
        </View>
      ))}

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#1e90ff' }]} // Blue
        onPress={() => navigation.navigate('Chef')}
      >
        <Text style={styles.buttonText}>Chef Management</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#28a745' }]} // Green
        onPress={() => navigation.navigate('Guest')}
      >
        <Text style={styles.buttonText}>Guest Filter</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

function ChefScreen({ menuItems, setMenuItems }) {
  const [dishName, setDishName] = useState('');
  const [description, setDescription] = useState('');
  const [course, setCourse] = useState('Starters');
  const [price, setPrice] = useState('');

  const addMenuItem = () => {
    if (!dishName || !description || !price) {
      alert('Please fill all fields');
      return;
    }

    const newItem = {
      id: Date.now().toString(),
      dishName,
      description,
      course,
      price: parseFloat(price)
    };

    setMenuItems(prev => [...prev, newItem]);

    setDishName('');
    setDescription('');
    setPrice('');
  };

  const deleteItem = (id) => {
    Alert.alert(
      'Delete Item',
      'Are you sure?',
      [
        { text: 'Cancel' },
        {
          text: 'Delete',
          onPress: () =>
            setMenuItems(prev =>
              prev.filter(item => item.id !== id)
            )
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        Chef Management
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Dish Name"
        value={dishName}
        onChangeText={setDishName}
      />

      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />

      <Picker selectedValue={course} onValueChange={setCourse}>
        <Picker.Item label="Starters" value="Starters" />
        <Picker.Item label="Main" value="Main" />
        <Picker.Item label="Dessert" value="Dessert" />
      </Picker>

      <TextInput
        style={styles.input}
        placeholder="Price"
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
      />

      <Button title="Add Menu Item" onPress={addMenuItem} />

      <Text style={styles.subtitle}>
        Current Menu
      </Text>

      {menuItems.map(item => (
        <View key={item.id} style={styles.item}>
          <Text style={styles.itemText}>
            {item.dishName}
          </Text>
          <Text>{item.description}</Text>
          <Text>R{item.price}</Text>
          <Button
            title="Delete"
            color="red"
            onPress={() => deleteItem(item.id)}
          />
        </View>
      ))}
    </ScrollView>
  );
}

function GuestScreen({ menuItems }) {
  const [filter, setFilter] = useState('All');

  const filteredItems =
    filter === 'All'
      ? menuItems
      : menuItems.filter(item => item.course === filter);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        Guest Menu Filter
      </Text>

      <Picker selectedValue={filter} onValueChange={setFilter}>
        <Picker.Item label="All" value="All" />
        <Picker.Item label="Starters" value="Starters" />
        <Picker.Item label="Main" value="Main" />
        <Picker.Item label="Dessert" value="Dessert" />
      </Picker>

      {filteredItems.map(item => (
        <View key={item.id} style={styles.item}>
          <Text style={styles.itemText}>
            {item.dishName}
          </Text>
          <Text>{item.description}</Text>
          <Text>R{item.price}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

export default function App() {
  const [menuItems, setMenuItems] = useState([
    {
      id:'1',
      dishName:'Chicken Livers',
      description:'Creamy garlic sauce with ciabatta',
      course:'Starters',
      price:150
    },
      {
      id:'1',
      dishName:'California Rolls',
      description:'Inside-out seaweed wrap crabstick, avocado, cucumber and sesame seed',
      course:'Starters',
      price:105
    },
    {
      id:'2',
      dishName:'Creamy Musroom with Prawn Pasta',
      description:'Creamy pasta with prawns sauteed mushrooms, garlic and a rich parmesan cream sauce',
      course:'Main',
      price:205
    },
    {
      id:'2',
      dishName:'Fried Rice',
      description:'Savoury stir fried rice served with tender chicken in a rich, buttery cream sauce',
      course:'Main',
      price:150
    },
    {
      id:'3',
      dishName:'Malva Pudding',
      description:'With homemade custard',
      course:'Dessert',
      price:70
    },
    {
      id:'3',
      dishName:'Peppermint Tart',
      description:'Creamy caramel and whipped filling layered with peppermint crisp chocolate on a soft biscuit base',
      course:'Dessert',
      price:75
    }
  ]);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home">
          {(props) => (
            <HomeScreen {...props} menuItems={menuItems} />
          )}
        </Stack.Screen>
        <Stack.Screen name="Chef">
          {(props) => (
            <ChefScreen {...props} menuItems={menuItems} setMenuItems={setMenuItems} />
          )}
        </Stack.Screen>
        <Stack.Screen name="Guest">
          {(props) => (
            <GuestScreen {...props} menuItems={menuItems} />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginVertical: 5,
  },
  item: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
  },
  itemText: {
    fontWeight: 'bold',       
  },
  button: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
