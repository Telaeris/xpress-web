import xptLogo from '~/assets/images/xpt-logo.png';
import xpeLogo from '~/assets/images/xpe-logo.png';

export const useTheme = () => {
    const config = useRuntimeConfig();
    
    const theme = useState<string>((): string => config.public.theme || 'xpt');
    
    const getMainLogoPath = computed(() => {
        switch (theme.value) {
            case 'xpt':
                return xptLogo;
            case 'xpe':
                return xpeLogo;
            default:
                return xptLogo;
        }
    });

    const getIconPath = computed(() => {
        return `~/assets/images/${theme.value}-small.png`;
    });

    return {
        theme,
        getMainLogoPath,
        getIconPath,
    };
}
