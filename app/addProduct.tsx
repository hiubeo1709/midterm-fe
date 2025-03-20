import React, { useState } from 'react';
import { router } from 'expo-router';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Image,
    ScrollView,
    Alert,
    Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

type AddProductProps = {
    onAddProduct: (product: {
        name: string;
        type: string;
        price: number;
        image: string;
    }) => void;
};

export default function AddProductScreen({ onAddProduct }: AddProductProps) {
    const [name, setName] = useState('');
    const [type, setType] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const [errors, setErrors] = useState<{
        name?: string;
        type?: string;
        price?: string;
        image?: string;
    }>({});

    const pickImage = async () => {
        // Request permission
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            Alert.alert('Permission Required', 'Sorry, we need camera roll permissions to make this work!');
            return;
        }

        // Launch image picker
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            setImage(result.assets[0].uri);
            setErrors({ ...errors, image: undefined });
        }
    };

    const handleSubmit = async () => {
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
            const response = await axios.post("http://10.0.2.2:8083/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            router.back()
        } catch (error) {
            console.error("Lỗi khi upload:", error);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Add New Product</Text>
            </View>

            <View style={styles.form}>
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Product Name</Text>
                    <TextInput
                        style={styles.input}
                        value={name}
                        onChangeText={(text) => {
                            setName(text);
                            if (errors.name) setErrors({ ...errors, name: undefined });
                        }}
                        placeholder="Enter product name"
                    />
                    {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Product Type</Text>
                    <TextInput
                        style={styles.input}
                        value={type}
                        onChangeText={(text) => {
                            setType(text);
                            if (errors.type) setErrors({ ...errors, type: undefined });
                        }}
                        placeholder="Enter product type"
                    />
                    {errors.type ? <Text style={styles.errorText}>{errors.type}</Text> : null}
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Price</Text>
                    <TextInput
                        style={styles.input}
                        value={price}
                        onChangeText={(text) => {
                            setPrice(text);
                            if (errors.price) setErrors({ ...errors, price: undefined });
                        }}
                        placeholder="Enter price"
                        keyboardType="numeric"
                    />
                    {errors.price ? <Text style={styles.errorText}>{errors.price}</Text> : null}
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Product Image</Text>
                    <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                        {image ? (
                            <Image source={{ uri: image }} style={styles.previewImage} />
                        ) : (
                            <View style={styles.placeholderContainer}>
                                <Text style={styles.placeholderText}>Tap to select image</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                    {errors.image ? <Text style={styles.errorText}>{errors.image}</Text> : null}
                </View>

                <View style={styles.buttonGroup}>
                    <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                        <Text style={styles.submitButtonText}>Add Product</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.cancelButton} onPress={router.back}>
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 40,
        backgroundColor: '#F9FAFB',
    },
    header: {
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111827',
    },
    form: {
        padding: 16,
    },
    formGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        color: '#374151',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
    },
    imagePicker: {
        width: '100%',
        height: 200,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        overflow: 'hidden',
    },
    previewImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    placeholderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
    },
    placeholderText: {
        color: '#6B7280',
        fontSize: 16,
    },
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    submitButton: {
        backgroundColor: '#4F46E5',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        flex: 1,
        marginRight: 8,
    },
    submitButtonText: {
        color: '#FFFFFF',
        fontWeight: '600',
        fontSize: 16,
        textAlign: 'center',
    },
    cancelButton: {
        backgroundColor: '#FFFFFF',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        flex: 1,
        marginLeft: 8,
    },
    cancelButtonText: {
        color: '#4B5563',
        fontWeight: '600',
        fontSize: 16,
        textAlign: 'center',
    },
    errorText: {
        color: '#EF4444',
        fontSize: 14,
        marginTop: 4,
    },
});
