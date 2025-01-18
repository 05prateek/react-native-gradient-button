import React from 'react';
import {
    TouchableOpacity,
    View,
    Text,
    StyleSheet,
    StyleProp,
    ViewStyle,
    TextStyle,
    TouchableOpacityProps,
    ActivityIndicator,
} from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import LinearGradient from 'react-native-linear-gradient';

export interface GradientButtonProps extends TouchableOpacityProps {
    // Required props
    text: string;
    colors: string[];

    // Optional props
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    loading?: boolean;
    loadingColor?: string;
    loadingSize?: 'small' | 'large';

    // LinearGradient props
    start?: { x: number; y: number };
    end?: { x: number; y: number };
    locations?: number[];
    useAngle?: boolean;
    angle?: number;
    angleCenter?: { x: number; y: number };

    // Accessibility props
    accessibilityRole?: 'button';
    accessibilityLabel?: string;
    accessibilityHint?: string;
}

/**
 * A customizable gradient button component for React Native
 * 
 * @example
 * ```tsx
 * <GradientButton
 *   text="Submit"
 *   onPress={() => console.log('pressed')}
 *   colors={['#FF0000', '#00FF00']}
 *   style={{ borderRadius: 8 }}
 * />
 * ```
 * 
 * @property {string} text - The text to display on the button
 * @property {() => void} onPress - Function to call when button is pressed
 * @property {string[]} colors - Array of at least 2 colors for the gradient
 * @property {StyleProp<ViewStyle>} [style] - Optional styles for the button
 * @property {StyleProp<TextStyle>} [textStyle] - Optional styles for the button text
 * ...
 */

const GradientButton: React.FC<GradientButtonProps> = ({
    // Required props
    text,
    colors,
    onPress,

    // Optional props
    style,
    textStyle,
    loading = false,
    loadingColor = '#FFFFFF',
    loadingSize = 'small',

    // LinearGradient props
    start = { x: 0, y: 0 },
    end = { x: 1, y: 0 },
    locations,
    useAngle = false,
    angle = 0,
    angleCenter,

    // TouchableOpacity props
    disabled = false,
    activeOpacity = 0.7,

    // Accessibility props
    accessibilityRole = 'button',
    accessibilityLabel,
    accessibilityHint,

    ...touchableProps
}) => {
    if (!text) {
        throw new Error('GradientButton: text prop is required');
    }
    
    if (!colors || !Array.isArray(colors) || colors.length < 2) {
        throw new Error('GradientButton: colors prop is required and must be an array of at least 2 colors');
    }

    // Validate color format
    colors.forEach((color, index) => {
        if (typeof color !== 'string') {
            throw new Error(`GradientButton: colors[${index}] must be a string`);
        }
    });

    // Add validation for textStyle color properties
    if (textStyle && typeof textStyle === 'object') {
        const textStyleObj = textStyle as Record<string, any>;
        const restrictedTextProps = [
            'color', 
            'textDecorationColor', 
            'textShadowColor'
           
        ];
        
        restrictedTextProps.forEach(prop => {
            if (prop in textStyleObj) {
                console.warn(`GradientButton: "${prop}" in textStyle prop is not allowed.`);
                delete textStyleObj[prop];
            }
        });
    }

    // Utility function to split and filter styles
    const splitStyle = (style: StyleProp<ViewStyle> | undefined) => {
        const outerStyle: ViewStyle = {};
        const innerStyle: ViewStyle = {};

        if (style && typeof style === 'object' && !Array.isArray(style)) {
            // Type assertion to handle ViewStyle indexing
            const styleObj = style as Record<string, any>;
            
            Object.entries(styleObj).forEach(([key, value]) => {
                if (
                    ['backgroundColor', 'borderColor', 'shadowColor', 'color'].includes(key)
                ) {
                    console.warn(`The property "${key}" is not allowed in the style prop.`);
                } else if (
                    [
                        'width',
                        'height',
                        'margin',
                        'marginTop',
                        'marginBottom',
                        'marginLeft',
                        'marginRight',
                        'marginHorizontal',
                        'marginVertical',
                        'padding',
                        'paddingTop',
                        'paddingBottom',
                        'paddingLeft',
                        'paddingRight',
                        'paddingHorizontal',
                        'paddingVertical',
                    ].includes(key)
                ) {
                    (outerStyle as any)[key] = value;
                } else {
                    (innerStyle as any)[key] = value;
                }
            });
        }

        return { outerStyle, innerStyle };
    };

    const { outerStyle, innerStyle } = splitStyle(style);

    return (
        <View style={outerStyle}>
            <TouchableOpacity
                onPress={onPress}
                disabled={disabled || loading}
                activeOpacity={activeOpacity}
                accessibilityRole={accessibilityRole}
                accessibilityLabel={accessibilityLabel || text}
                accessibilityHint={accessibilityHint}
                {...touchableProps}
                style={styles.button}
            >
                <View style={styles.buttonContent}>
                    <MaskedView
                        maskElement={
                            <View
                                pointerEvents="none"
                                style={[styles.maskContainer, innerStyle]}
                                collapsable={false}
                            >
                                {loading ? (
                                    <ActivityIndicator 
                                        color={loadingColor} 
                                        size={loadingSize}
                                    />
                                ) : (
                                    <Text style={[styles.buttonText, textStyle]}>
                                        {text}
                                    </Text>
                                )}
                            </View>
                        }
                        style={StyleSheet.absoluteFill}
                        pointerEvents="none"
                    >
                        <LinearGradient
                            style={StyleSheet.absoluteFill}
                            pointerEvents="none"
                            colors={colors}
                            start={start}
                            end={end}
                            locations={locations}
                            useAngle={useAngle}
                            angle={angle}
                            angleCenter={angleCenter}
                        />
                    </MaskedView>
                </View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    button: {
        width: '100%',
    },
    buttonContent: {//should not be changed
        width: '100%',//should not be changed
        height: '100%',//should not be changed
    },
    maskContainer: {
        width: '100%',//should not be changed
        height: '100%',//should not be changed
        borderRadius: 60,
        padding: '10%',
    },
    innerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#000000',  // required for the gradient to work
        textShadowColor: '#000000',  // required for the  gradient shadow to work
    },
});

export default GradientButton;