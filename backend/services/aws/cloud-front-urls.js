import env from '../../config/index.js';
export const cloudFrontUrl = (key) => {
    try {
        if (key !== '' && !key.includes(env.CLOUD_FRONT_URL)) {
            return env.CLOUD_FRONT_URL + key;
        } else {
            return key;
        }
    } catch (error) {
        console.error(error);
        throw new Error(error)
    }
}
