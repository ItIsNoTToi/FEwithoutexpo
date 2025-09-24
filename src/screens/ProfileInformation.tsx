/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { Text, TextInput, Button, StyleSheet, View, TouchableOpacity } from "react-native";
import { Picker } from "@react-native-picker/picker";
import User from "../models/user";

interface ProfileInformationProp {
  user: User;
  onSave?: (updatedUser: User) => void; // callback khi bấm lưu
}

const ProfileInformationForm = ({ user, onSave }: ProfileInformationProp) => {
    const [username, setUsername] = useState(user.username);
    const [email, setEmail] = useState(user.email || "");
    const [phone, setPhone] = useState(user.Phone || "");
    const [firstName, setFirstName] = useState(user.UserDetail?.FirstName || "");
    const [lastName, setLastName] = useState(user.UserDetail?.LastName || "");
    const [gender, setGender] = useState(user.UserDetail?.Gender || "Other");
    const [level, setLevel] = useState(user.UserDetail?.level || "beginner");
    const [dateOfBirth, setDateOfBirth] = useState(user.UserDetail?.DateOfBirth ? new Date(user.UserDetail.DateOfBirth).toISOString().split('T')[0] : "");
    const [Address, setAddress] = useState(user.UserDetail?.Address || "");
    const [bio, setBio] = useState(user.UserDetail?.bio || "");

    const handleSave = async () => {
        const updatedUser: User = {
        ...user,
        username,
        email,
        Phone: phone,
        UserDetail: {
            ...user.UserDetail,
            Address: Address,
            FirstName: firstName,
            LastName: lastName,
            Gender: gender as "Male" | "Female" | "Other",
            bio,
            updatedAt: new Date(),
        } as any,
        updatedAt: new Date(),
        };

        await onSave?.(updatedUser);
    };

    return (
        <View style={styles.container}>
        <Text style={styles.title}>Profile Information</Text>

        <Text style={styles.text}>Username:</Text>
        <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
        />

        <Text style={styles.text}>Email:</Text>
        <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
        />

        <Text style={styles.text}>Phone:</Text>
        <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
        />

        <Text style={styles.text}>First Name:</Text>
        <TextInput
            style={styles.input}
            value={firstName}
            onChangeText={setFirstName}
        />

        <Text style={styles.text}>Last Name:</Text>
        <TextInput
            style={styles.input}
            value={lastName}
            onChangeText={setLastName}
        />

        <Text style={styles.text}>Gender: </Text>
        <Picker style={styles.Picker} selectedValue={gender} onValueChange={(value: any) => setGender(value)}>
            <Picker.Item label="Male" value="Male" />
            <Picker.Item label="Female" value="Female" />
            <Picker.Item label="Other" value="Other" />
        </Picker>

        <Text style={styles.text}>Address:</Text>
        <TextInput
            style={styles.input}
            value={Address}
            onChangeText={setAddress}
        />

        <Text style={styles.text}>Level: {level}</Text>
        <Text style={styles.text}>Date of birth: {dateOfBirth}</Text>

        <Text style={styles.text}>Bio: </Text>
        <TextInput
            style={[styles.input, { height: 100 }] as any}
            value={bio}
            onChangeText={setBio}
            multiline
        />

        <TouchableOpacity style={styles.btn} onPress={handleSave}>
            <Text style={styles.text}>Save</Text>
        </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    text: {
        color: "#fff",
    },
    Picker:{
        color: "#fff",
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 12,
        color: "#fff",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 8,
        marginBottom: 12,
        color: "#fff",
    },
    btn:{
        backgroundColor: "#007AFF",
        padding: 10,
        borderRadius: 8,
        alignItems: "center",
    },
});

export default ProfileInformationForm;
