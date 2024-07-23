//
import { useState, useEffect } from 'react';
import * as Font from 'expo-font';

const useFonts = () => {
    const [fontLoaded, setFontLoaded] = useState(false);

    useEffect(() => {
        const loadFont = async () => {
            await Font.loadAsync({
                'Chewy-Regular': require('../assets/fonts/Chewy-Regular.ttf'),
                'Urbanist-VariableFont': require('../assets/fonts/Urbanist-VariableFont.ttf')
            });
            setFontLoaded(true);
        };
        loadFont();
    }, []);

    return fontLoaded;
};

export default useFonts;
