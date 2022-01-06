import MMKVStorage from 'react-native-mmkv-storage';

const MMKV = new MMKVStorage.Loader().initialize(); // Returns an MMKV Instance

export const getMyStorageItem = (option) => {
  try {
    const data = MMKV.getMap('feeeling');
    if (!data) {
      return false;
    } else {
      const parseData = data;
      //console.log(data);
      if (option) {
        //console.log('option>' + option);
        //console.log(parseData[option] ? parseData[option] : false);
        return parseData[option] ? parseData[option] : false;
      } else {
        return parseData;
      }
    }
  } catch (e) {
    console.log('module localstorage > ' + e);
    return false;
  }
};

export const setMyStorageItem = (jsonObj) => {
  try {
    console.log('setMyStorageItem-----!!!-----');
    //console.log(jsonObj);
    //console.log(typeof jsonObj);
    let res;
    MMKV.setMap('feeeling', jsonObj, (error, result) => {
      //console.log('----------------callback----------------');
      if (error) {
        //console.log('setmap err');
        //console.log(error);
        return;
      }
      //console.log('setMap result..');
      //console.log(result);
      res = result;
    });
    return res;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const deleteMyStorage = async (key) => {
  //console.log('delete storage -> ' + key);
  const asyncStorageData = await getMyStorageItem();
  if (await getMyStorageItem(key)) {
    //console.log('inif -> ' + key);
    let reData = Object.assign({}, asyncStorageData);
    //console.log('delete > ' + key);
    delete reData[key];
    //console.log(reData);
    return await setMyStorageItem(reData);
  }
};

export const saveAsyncStorage = async (key, value) => {
  const asyncStorageData = await getMyStorageItem();
  //console.log(asyncStorageData);
  let reData = Object.assign({}, asyncStorageData);
  //console.log(key, value);
  reData[key] = value;
  return await setMyStorageItem(reData);
};

// export const getMyStorageItem = async (option) => {
//   try {
//     const data = await AsyncStorage.getItem('feeeling');
//     if (!data) {
//       return false;
//     } else {
//       const parseData = await JSON.parse(data);
//       if (option) {
//         // console.log('option>' + option);
//         // console.log(parseData[option] ? parseData[option] : false);
//         return parseData[option] ? parseData[option] : false;
//       } else {
//         return parseData;
//       }
//     }
//   } catch (e) {
//     console.log('module localstorage > ' + e);
//     return false;
//   }
// };

// export const setMyStorageItem = async (jsonObj) => {
//   try {
//     return await AsyncStorage.setItem('feeeling', JSON.stringify(jsonObj));
//   } catch (e) {
//     console.log(e);
//     return false;
//   }
// };

// export const deleteMyStorage = async (key) => {
//   //console.log('delete storage -> ' + key);
//   const asyncStorageData = await getMyStorageItem();
//   if (await getMyStorageItem(key)) {
//     //console.log('inif -> ' + key);
//     let reData = Object.assign({}, asyncStorageData);
//     await delete reData[key];
//     //console.log(reData);
//     return await setMyStorageItem(reData);
//   }
// };

// export const saveAsyncStorage = async (key, value) => {
//   const asyncStorageData = await getMyStorageItem();
//   //console.log(asyncStorageData);
//   let reData = Object.assign({}, asyncStorageData);
//   //console.log(reData);
//   reData[key] = value;
//   //console.log(reData);
//   return await setMyStorageItem(reData);
// };
