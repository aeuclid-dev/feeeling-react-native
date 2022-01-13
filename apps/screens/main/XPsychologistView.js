import React from 'react';
import { View, Image, Text, TouchableOpacity } from 'react-native';

import defaultProfileIcon from '../../resource/X/images/defaultProfileIcon.png';
import defaultMap from '../../resource/X/images/defaultMap.jpg';
import commentIcon from '../../resource/X/icons/comment.png';
import heartIcon from '../../resource/X/icons/heart.png';
import shareIcon from '../../resource/X/icons/share.png';
import bookmarkIcon from '../../resource/X/icons/bookmark.png';
import postIcon from '../../resource/X/icons/post.png';

export default function XPsychologistView(props) {
    return (<View style={styles.view}>
        <View style={styles.profile}>
            <TouchableOpacity onPress={()=>console.log('psychologist view')}>
                <Image source={defaultProfileIcon} style={styles.profileImg} />
            </TouchableOpacity>
        </View>
        <View style={styles.card} >
            <View style={styles.usernameview}>
                <Text style={styles.username}>베네하임</Text>
                <Text style={styles.userid}>@beneheim</Text>
            </View>
            <Text style={styles.userdesc}>
                베네하임 (BeneHeim){"\n"}
                {"\n"}
                ‘통찰력이 생기는 집’이라는 의미 들숨과 날숨처럼 무의식적 작업이라는 호흡을 통해 내담자에게 ‘새로운 숨....통찰력...치유와 회복의 삶을 살아가도록 돕는 상담기관’을 의미{"\n"}
                {"\n"}
                디자인 컨셉{"\n"}
                {"\n"}
                꽃에서 홀씨가 되어서 날아가는 이미지 꽃은 하임을 홀씨는 생명의 연속성을 의미
            </Text>
            <Image source={defaultMap} style={styles.usermap} />
            <View style={styles.buttonview}>
                <View style={styles.buttondef}>
                    <Image source={commentIcon} style={styles.buttonimg} />
                    <Image source={heartIcon} style={styles.buttonimg} />
                    <Image source={shareIcon} style={styles.buttonimg} />
                    <Image source={bookmarkIcon} style={styles.buttonimg} />
                </View>
                <View style={styles.buttonchatview} >
                    <TouchableOpacity onPress={() => console.log('move')}>
                        <Image source={postIcon} style={styles.buttonchat} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    </View>);
}

const styles = {
    view: {
        marginStart: 5,
        marginEnd: 5,
        marginTop: 5,
        flexDirection: "row",
        borderBottomEndRadius: 5,
        borderBottomStartRadius: 5,
        borderTopEndRadius: 5,
        borderTopStartRadius: 5,
        borderWidth: 1,
        borderColor: '#000000'
    },
    profile: {
        flex: 0.2,
        paddingTop: 5,
        alignItems: 'center'
    },
    profileImg: {
        width: 70,
        height: 70
    },
    card: {
        flex: 0.8,
        flexDirection: "column"
    },
    username: {
        fontSize: 20,
        margin: 5
    },
    userid: {
        fontSize: 20,
        margin: 5
    },
    userdesc: {
        margin: 5
    },
    usernameview: {
        flexDirection: "row",
        paddingTop: 5
    },
    usermap: {
        margin: 5,
        aspectRatio: 1,
        width: '95%',
        height: undefined
    },
    buttonview: {
        flexDirection: "row"
    },
    buttondef: {
        flex: 0.5,
        flexDirection: "row"
    },
    buttonimg: {
        margin: 15,
        aspectRatio: 1,
        width: 24,
        height: undefined
    },
    buttonchatview: {
        flex: 0.5,
        alignItems: 'flex-end'
    },
    buttonchat: {
        margin: 15,
        aspectRatio: 1,
        width: 24,
        height: undefined
    }
};

