import { isMobile, isTablet, isDesktop, browserName, browserVersion } from 'react-device-detect';
import axios from 'axios';

const deviceInfo = async () => {

    const userAgent = navigator.userAgent;

    const browserInfo = userAgent.match(/(Chrome|Firefox|Safari|Edge|Opera)\/([\d.]+)/);

    console.log('Browser Info:', browserInfo);
    let browserName = '';
    let browserVersion = '';

    if(browserInfo){
        browserName = browserInfo[1];
        browserVersion = browserInfo[2];
    }


    try {
        const response = await axios.get('https://api.ipify.org?format=json');
        const deviceIP = response.data.ip;

        return {
            isMobile: isMobile,
            isTablet: isTablet,
            isDesktop: isDesktop,
            browserName : browserName,
            browserVersion: browserVersion,
            OS : navigator.platform,
            deviceIP: deviceIP
        };
    } catch (error) {
        console.log(error);
        return {
            isMobile: isMobile,
            isTablet: isTablet,
            isDesktop: isDesktop,
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            deviceIP: 'Unknown IP'
        };
    }
};

export default deviceInfo;
