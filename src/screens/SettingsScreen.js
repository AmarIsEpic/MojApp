import { Ionicons } from '@expo/vector-icons';
import { useContext } from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { ThemeContext } from '../theme/ThemeContext';

export default function SettingsScreen() {
    const { 
        mode, setMode, isDark, toggleDark, 
        units, toggleUnits, 
        backgroundAnimation, toggleBackgroundAnimation 
    } = useContext(ThemeContext);

    const SettingItem = ({ icon, iconColor, label, description, value, onValueChange, disabled = false }) => (
        <View style={[styles.settingCard, isDark && styles.settingCardDark]}>
            <View style={styles.settingLeft}>
                <Ionicons name={icon} size={24} color={iconColor} />
                <View style={styles.settingTextContainer}>
                    <Text style={[styles.settingLabel, isDark && styles.textDark]}>{label}</Text>
                    <Text style={[styles.settingDescription, isDark && styles.textSecondaryDark]}>{description}</Text>
                </View>
            </View>
            <Switch 
                value={value} 
                onValueChange={onValueChange} 
                disabled={disabled}
                trackColor={{ false: isDark ? '#1B2837' : '#E0E0E0', true: isDark ? '#2A3A4F' : '#5EE1FF' }}
                thumbColor={value ? '#5EE1FF' : '#F4F3F4'}
            />
        </View>
    );

    return (
        <ScrollView style={[styles.container, isDark && styles.containerDark]} contentContainerStyle={styles.content}>
            <Text style={[styles.title, isDark && styles.textDark]}>Postavke</Text>

            <Text style={[styles.sectionTitle, isDark && styles.textDark]}>Tema i Prikaz</Text>
            
            <SettingItem
                icon="phone-portrait-outline"
                iconColor="#8AB4F8"
                label="Prati sistem"
                description="Automatsko prebacivanje teme"
                value={mode === 'system'}
                onValueChange={(v) => setMode(v ? 'system' : (isDark ? 'dark' : 'light'))}
            />

            <SettingItem
                icon={isDark ? 'moon' : 'sunny'}
                iconColor={isDark ? '#7D5CFF' : '#FFD369'}
                label="Tamni režim"
                description="Ručno prebacivanje teme"
                value={isDark}
                onValueChange={toggleDark}
                disabled={mode === 'system'}
            />

            <SettingItem
                icon="snow-outline"
                iconColor="#B3F0FF"
                label="Animacija pozadine"
                description="Omogući/onemogući animaciju"
                value={backgroundAnimation}
                onValueChange={toggleBackgroundAnimation}
            />

            <Text style={[styles.sectionTitle, isDark && styles.textDark]}>Mjerenja</Text>

            <SettingItem
                icon="thermometer-outline"
                iconColor="#FFB4A2"
                label={units === 'metric' ? 'Celsius (°C)' : 'Fahrenheit (°F)'}
                description="Jedinice za temperaturu"
                value={units === 'imperial'}
                onValueChange={toggleUnits}
            />

            <View style={[styles.infoCard, isDark && styles.infoCardDark]}>
                <Ionicons name="information-circle-outline" size={24} color={isDark ? '#8AB4F8' : '#5EE1FF'} />
                <Text style={[styles.infoText, isDark && styles.textDark]}>
                    Sve postavke se automatski čuvaju i primjenjuju na svim ekranima.
                </Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F9FC',
    },
    containerDark: {
        backgroundColor: '#0B0F14',
    },
    content: {
        padding: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 32,
        color: '#0B0F14',
        fontFamily: 'Nunito_800ExtraBold',
    },
    textDark: {
        color: '#E6EDF3',
    },
    textSecondaryDark: {
        color: '#B8C4CF',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        marginTop: 24,
        marginBottom: 16,
        color: '#0B0F14',
        fontFamily: 'Nunito_700Bold',
    },
    settingCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(94,225,255,0.15)',
    },
    settingCardDark: {
        backgroundColor: 'rgba(15,22,33,0.6)',
        borderColor: 'rgba(94,225,255,0.15)',
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: 16,
    },
    settingTextContainer: {
        marginLeft: 12,
        flex: 1,
    },
    settingLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#0B0F14',
        marginBottom: 4,
    },
    settingDescription: {
        fontSize: 13,
        color: '#6B7280',
        lineHeight: 18,
    },
    infoCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderRadius: 16,
        padding: 16,
        marginTop: 32,
        borderWidth: 1,
        borderColor: 'rgba(94,225,255,0.15)',
    },
    infoCardDark: {
        backgroundColor: 'rgba(15,22,33,0.6)',
    },
    infoText: {
        flex: 1,
        fontSize: 14,
        color: '#0B0F14',
        marginLeft: 12,
        lineHeight: 20,
    },
});