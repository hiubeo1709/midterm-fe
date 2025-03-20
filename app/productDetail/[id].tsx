import React, { useState, useEffect } from "react";
import { useLocalSearchParams, router } from "expo-router";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Image,
    ScrollView,
    Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";

export default function EditProductScreen() {
    const { id } = useLocalSearchParams(); // Lấy ID từ route params
    const [name, setName] = useState("");
    const [type, setType] = useState("");
    const [price, setPrice] = useState("");
    const [image, setImage] = useState<string | null>(null);
    const [oldImage, setOldImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProduct();
    }, [id]);

    // Lấy thông tin sản phẩm theo ID
    const fetchProduct = async () => {
        try {
            const response = await axios.get(`http://10.0.2.2:8083/products/${id}`);
            const { name, type, cost, image } = response.data;
            setName(name);
            setType(type);
            setPrice(cost.toString());
            setImage(image);
            setOldImage(image);
        } catch (error) {
            console.error("Lỗi khi lấy sản phẩm:", error);
            Alert.alert("Lỗi", "Không thể lấy thông tin sản phẩm!");
        } finally {
            setLoading(false);
        }
    };

    // Chọn ảnh từ thư viện
    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
            Alert.alert("Permission Required", "Cần quyền truy cập ảnh!");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.canceled && result.assets.length > 0) {
            setImage(result.assets[0].uri);
        }
    };

    // Cập nhật sản phẩm
    const handleUpdate = async () => {
        if (!name || !type || !price || !image) {
            alert("Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        const file = {
            uri: image,
            type: "image/jpeg",
            name: "upload.jpg",
        };

        const formData = new FormData();
        formData.append("name", name);
        formData.append("type", type);
        formData.append("cost", price);
        //@ts-ignore
        formData.append("image", file);

        try {
            await axios.put(`http://10.0.2.2:8083/products/${id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
                timeout: 5000
            });
            Alert.alert('Thành công', 'Sản phẩm đã được cập nhật.');
            router.back(); // Quay lại trang trước
        } catch (error) {
            console.error('Lỗi khi cập nhật sản phẩm:', error);
            Alert.alert('Lỗi', 'Không thể cập nhật sản phẩm.');
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Chỉnh sửa sản phẩm</Text>
            </View>

            <View style={styles.form}>
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Tên sản phẩm</Text>
                    <TextInput
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                        placeholder="Nhập tên sản phẩm"
                    />
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Loại sản phẩm</Text>
                    <TextInput
                        style={styles.input}
                        value={type}
                        onChangeText={setType}
                        placeholder="Nhập loại sản phẩm"
                    />
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Giá</Text>
                    <TextInput
                        style={styles.input}
                        value={price}
                        onChangeText={setPrice}
                        placeholder="Nhập giá"
                        keyboardType="numeric"
                    />
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Hình ảnh</Text>
                    <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                        {image ? (
                            <Image source={{ uri: image != oldImage ? image : `http://10.0.2.2:8083${oldImage}` }} style={styles.previewImage} />
                        ) : (
                            <View style={styles.placeholderContainer}>
                                <Text style={styles.placeholderText}>Nhấn để chọn ảnh</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>

                <View style={styles.buttonGroup}>
                    <TouchableOpacity style={styles.submitButton} onPress={handleUpdate}>
                        <Text style={styles.submitButtonText}>Cập nhật</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
                        <Text style={styles.cancelButtonText}>Hủy</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, paddingTop: 40, backgroundColor: "#F9FAFB" },
    header: { padding: 16, backgroundColor: "#FFF", borderBottomWidth: 1, borderBottomColor: "#E5E7EB" },
    headerTitle: { fontSize: 20, fontWeight: "bold", color: "#111827" },
    form: { padding: 16 },
    formGroup: { marginBottom: 20 },
    label: { fontSize: 16, fontWeight: "500", color: "#374151", marginBottom: 8 },
    input: { backgroundColor: "#FFF", borderWidth: 1, borderColor: "#D1D5DB", borderRadius: 8, padding: 12, fontSize: 16 },
    imagePicker: { width: "100%", height: 200, borderWidth: 1, borderColor: "#D1D5DB", borderRadius: 8 },
    previewImage: { width: "100%", height: "100%", resizeMode: "cover" },
    placeholderContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F3F4F6" },
    placeholderText: { color: "#6B7280", fontSize: 16 },
    buttonGroup: { flexDirection: "row", justifyContent: "space-between", marginTop: 20 },
    submitButton: { backgroundColor: "#4F46E5", paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8, flex: 1, marginRight: 8 },
    submitButtonText: { color: "#FFF", fontWeight: "600", fontSize: 16, textAlign: "center" },
    cancelButton: { backgroundColor: "#FFF", paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8, borderWidth: 1, borderColor: "#D1D5DB", flex: 1, marginLeft: 8 },
    cancelButtonText: { color: "#4B5563", fontWeight: "600", fontSize: 16, textAlign: "center" },
});
