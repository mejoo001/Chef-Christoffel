import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  Alert
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function App() {
  const [dishName, setDishName] = useState('');
  const [description, setDescription] = useState('');
  const [course, setCourse] = useState('Starters');
  const [price, setPrice] = useState('');

  // ✅ ORIGINAL MENU
  const initialMenuItems = [
    { id: '1', dishName: 'Chicken Livers', description: 'Creamy garlic sauce with ciabatta', course: 'Starters', price: 150 },
    { id: '2', dishName: 'California Rolls', description: 'Inside-out seaweed wrap crabstick, avocado, cucumber and sesame seed', course: 'Starters', price: 105 },
    { id: '3', dishName: 'Mussels', description: 'Fresh mussels served in a velvety garlic and cream sauce infused with parsley and a touch of white wine', course: 'Starters', price: 220 },

    { id: '4', dishName: 'Prawn Pasta', description: 'Creamy pasta with juicy prawns,sauteed mushrooms, garlic and a risch parmesan cream sauce', course: 'Main', price: 205 },
    { id: '5', dishName: 'Butter Chicken Rice', description:  'Savoury stir fried rice served with tender chicken in a rich, buttery cream sauce', course: 'Main', price: 150 },
    { id: '6', dishName: 'Beef Burger', description: 'Two juicy beef patties with double chedder cheese, fresh toppings and crispy chips on the sid', course: 'Main', price: 185 },

    { id: '7', dishName: 'Malva Pudding', description: 'With homemade custard', course: 'Dessert', price: 70 },
    { id: '8', dishName: 'Peppermint Tart', description: 'Creamy caramel and whipped filling layered with peppermint crisp chocolate on a soft biscuit base', course: 'Dessert', price: 75 },
    { id: '9', dishName: 'Cheesecake', description: 'with Strawberry topping', course: 'Dessert', price: 65 },
  ];

  const [menuItems, setMenuItems] = useState(initialMenuItems);

  const courses = ['Starters', 'Main', 'Dessert'];

  // ✅ ADD ITEM
  const addMenuItem = () => {
    if (!dishName || !description || !price) {
      alert('Please fill in all fields');
      return;
    }

    if (isNaN(price) || Number(price) <= 0) {
      alert('Enter a valid price');
      return;
    }

    const newItem = {
      id: Date.now().toString(),
      dishName,
      description,
      course,
      price: parseFloat(price),
      isAdded: true
    };

    setMenuItems(prev => [...prev, newItem]);

    // ✅ clear inputs after adding
    setDishName('');
    setDescription('');
    setPrice('');
    setCourse('Starters');
  };

  // ✅ DELETE ITEM
  const deleteItem = (id) => {
    Alert.alert(
      "Delete Item",
      "Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setMenuItems(prev =>
              prev.filter(item => item.id !== id)
            );
          }
        }
      ]
    );
  };

  // ✅ ✅ CLEAR ADDED ITEMS + CLEAR INPUTS (FIXED)
  const clearMenu = () => {
    Alert.alert(
      "Clear Added Items",
      "Remove all added items?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "OK",
          onPress: () => {
            // ✅ remove only added items
            setMenuItems(prev =>
              prev.filter(item => !item.isAdded)
            );

            // ✅ clear inputs properly
            setDishName('');
            setDescription('');
            setPrice('');
            setCourse('Starters');
          }
        }
      ]
    );
  };

  // ✅ TOTAL COST (ONLY ADDED ITEMS)
  const addedItems = menuItems.filter(item => item.isAdded);

  const totalCost = addedItems.reduce(
    (sum, item) => sum + item.price,
    0
  );

  return (
    <ScrollView style={styles.container}>

      <Text style={styles.title}>Chef's Special Menu</Text>

      {/* INPUTS */}
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

      <Picker
        selectedValue={course}
        style={styles.input}
        onValueChange={(value) => setCourse(value)}
      >
        {courses.map(c => (
          <Picker.Item key={c} label={c} value={c} />
        ))}
      </Picker>

      <TextInput
        style={styles.input}
        placeholder="Price"
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
      />

      <Button title="Add Menu Item" onPress={addMenuItem} />
      <Button title="Clear Added Items" color="gray" onPress={clearMenu} />

      {/* TOTAL ITEMS */}
      <Text style={styles.subtitle}>
        Total Items: {menuItems.length}
      </Text>

      {/* MENU DISPLAY */}
      <Text style={styles.subtitle}>Chef's Menu</Text>

      {['Starters', 'Main', 'Dessert'].map(section => (
        <View key={section}>
          <Text style={styles.sectionTitle}>{section}</Text>

          {menuItems
            .filter(item => item.course === section)
            .map(item => (
              <View key={item.id} style={styles.item}>
                <Text style={styles.itemText}>
                  {item.dishName}
                  {item.isAdded && " (Added)"}
                </Text>

                <Text>{item.description}</Text>
                <Text>R{item.price.toFixed(2)}</Text>

                <Button
                  title="Delete"
                  color="red"
                  onPress={() => deleteItem(item.id)}
                />
              </View>
            ))}
        </View>
      ))}

      {/* TOTAL COST */}
      <Text style={styles.total}>
        Total Cost of Added Items: R{totalCost.toFixed(2)}
      </Text>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, marginTop: 40 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  subtitle: { fontSize: 18, marginVertical: 10, fontWeight: 'bold' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 10 },
  input: { borderWidth: 1, padding: 10, marginVertical: 5 },
  item: { padding: 10, marginVertical: 5, backgroundColor: '#f9f9f9', borderRadius: 5 },
  itemText: { fontWeight: 'bold' },
  total: { fontSize: 20, fontWeight: 'bold', marginTop: 20, color: '#2a9d8f' }
});