"use client"

import { useEffect, useState } from "react"
import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity, FlatList, Image, StatusBar, Alert } from "react-native"
import { Trash2, Edit, Plus, LucideStepBack } from "lucide-react-native"
import { router } from "expo-router"
import { useFocusEffect } from "expo-router"
import React from "react";
import axios from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage"

// Define the Product type
type Product = {
  id: string
  name: string
  type: string
  price: number
  image: string
}

// Initial mock data
const initialProducts: Product[] = [
  {
    id: "1",
    name: "Smartphone XYZ",
    type: "Electronics",
    price: 799.99,
    image: "https://via.placeholder.com/150",
  },
  {
    id: "2",
    name: "Leather Jacket",
    type: "Clothing",
    price: 199.99,
    image: "https://via.placeholder.com/150",
  },
  {
    id: "3",
    name: "Coffee Maker",
    type: "Home Appliance",
    price: 89.99,
    image: "https://via.placeholder.com/150",
  },
  {
    id: "4",
    name: "Running Shoes",
    type: "Footwear",
    price: 129.99,
    image: "https://via.placeholder.com/150",
  },
]


export default function App() {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://10.0.2.2:8083/products"); // Thay API của bạn
      const data = res.data;
      console.log(res.data)
      const formattedProducts: Product[] = data.map((item: any) => ({
        id: item._id,
        name: item.name,
        type: item.type,
        price: item.cost, // Đổi 'cost' thành 'price'
        image: item.image,
      }));
      setProducts(formattedProducts);
    } catch (error) {
      console.error("Lỗi khi fetch sản phẩm:", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchProducts();
    }, [])
  );

  const handleAddProduct = () => {
    router.push('/addProduct')
  }

  const handleEditProduct = (id: string) => {
    // In a real app, this would open a form to edit the product
    Alert.alert("Edit Product", `This would open a form to edit product with ID: ${id}`)
    router.push({ pathname: "/productDetail/[id]", params: { id } });
  }

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    router.replace("../(auth)/login");
  }

  const handleDeleteProduct = (id: string) => {
    Alert.alert("Delete Product", "Are you sure you want to delete this product?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: async () => {
          try {
            await axios.delete(`http://10.0.2.2:8083/products/${id}`);
            Alert.alert("Success", "Product deleted successfully");
            fetchProducts()
          } catch (error) {
            console.error("Error deleting product:", error);
            Alert.alert("Error", "Failed to delete product");
          }
        },
        style: "destructive",
      },
    ])
  }

  const renderProductItem = ({ item }: { item: Product }) => (
    <View style={styles.productCard}>
      <Image source={{ uri: `http://10.0.2.2:8083${item.image}` }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productType}>{item.type}</Text>
        <Text style={styles.productPrice}>${item.price}</Text>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.iconButton} onPress={() => handleEditProduct(item.id)}>
          <Edit size={20} color="#4F46E5" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={() => handleDeleteProduct(item.id)}>
          <Trash2 size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.addButton} onPress={handleLogout}>
          <LucideStepBack size={20} color="#FFFFFF" />
          <Text style={styles.addButtonText}>Logout</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.addButton} onPress={handleAddProduct}>
          <Plus size={20} color="#FFFFFF" />
          <Text style={styles.addButtonText}>Add Product</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={products}
        renderItem={renderProductItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.productList}
      />

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: "#F9FAFB",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4F46E5",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    marginLeft: 8,
  },
  productList: {
    padding: 16,
  },
  productCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
  },
  productInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: "center",
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  productType: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4F46E5",
  },
  actionButtons: {
    justifyContent: "center",
  },
  iconButton: {
    padding: 8,
    marginBottom: 8,
  },
})

