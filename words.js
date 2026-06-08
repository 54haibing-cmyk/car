/* ═══════════════════════════════════════════════════════
   words.js  –  Word Match Hero 关卡词库
   每关 8 对单词，img = emoji，word = 英文，cn = 中文
   ═══════════════════════════════════════════════════════ */

const LEVELS = [

/* ─── Level 1 · 动物王国 ─────────────────────────────── */
{
    id:   1,
    name: "🐾 动物王国",
    words: [
        { img:"🐶", word:"Dog",      cn:"狗"   },
        { img:"🐱", word:"Cat",      cn:"猫"   },
        { img:"🐰", word:"Rabbit",   cn:"兔子"  },
        { img:"🐻", word:"Bear",     cn:"熊"   },
        { img:"🐵", word:"Monkey",   cn:"猴子"  },
        { img:"🐘", word:"Elephant", cn:"大象"  },
        { img:"🦁", word:"Lion",     cn:"狮子"  },
        { img:"🐯", word:"Tiger",    cn:"老虎"  }
    ]
},

/* ─── Level 2 · 水果乐园 ─────────────────────────────── */
{
    id:   2,
    name: "🍎 水果乐园",
    words: [
        { img:"🍎", word:"Apple",      cn:"苹果"  },
        { img:"🍌", word:"Banana",     cn:"香蕉"  },
        { img:"🍇", word:"Grape",      cn:"葡萄"  },
        { img:"🍊", word:"Orange",     cn:"橙子"  },
        { img:"🍉", word:"Watermelon", cn:"西瓜"  },
        { img:"🍓", word:"Strawberry", cn:"草莓"  },
        { img:"🍍", word:"Pineapple",  cn:"菠萝"  },
        { img:"🥭", word:"Mango",      cn:"芒果"  }
    ]
},

/* ─── Level 3 · 美食天地 ─────────────────────────────── */
{
    id:   3,
    name: "🍔 美食天地",
    words: [
        { img:"🍔", word:"Hamburger", cn:"汉堡"   },
        { img:"🍕", word:"Pizza",     cn:"披萨"   },
        { img:"🌭", word:"Hotdog",    cn:"热狗"   },
        { img:"🍟", word:"Fries",     cn:"薯条"   },
        { img:"🍗", word:"Chicken",   cn:"鸡肉"   },
        { img:"🍩", word:"Donut",     cn:"甜甜圈"  },
        { img:"🍪", word:"Cookie",    cn:"饼干"   },
        { img:"🍰", word:"Cake",      cn:"蛋糕"   }
    ]
},

/* ─── Level 4 · 职业梦想 ─────────────────────────────── */
{
    id:   4,
    name: "👨‍💼 职业梦想",
    words: [
        { img:"👨‍⚕️", word:"Doctor",      cn:"医生"   },
        { img:"👨‍🏫", word:"Teacher",     cn:"老师"   },
        { img:"👮",   word:"Police",      cn:"警察"   },
        { img:"👨‍🚒", word:"Firefighter", cn:"消防员"  },
        { img:"👨‍🍳", word:"Chef",        cn:"厨师"   },
        { img:"👨‍🔧", word:"Engineer",    cn:"工程师"  },
        { img:"👨‍✈️", word:"Pilot",       cn:"飞行员"  },
        { img:"👨‍🌾", word:"Farmer",      cn:"农民"   }
    ]
},

/* ─── Level 5 · 颜色世界（扩展关卡）────────────────────── */
{
    id:   5,
    name: "🌈 颜色世界",
    words: [
        { img:"🔴", word:"Red",    cn:"红色"  },
        { img:"🟠", word:"Orange", cn:"橙色"  },
        { img:"🟡", word:"Yellow", cn:"黄色"  },
        { img:"🟢", word:"Green",  cn:"绿色"  },
        { img:"🔵", word:"Blue",   cn:"蓝色"  },
        { img:"🟣", word:"Purple", cn:"紫色"  },
        { img:"⚫", word:"Black",  cn:"黑色"  },
        { img:"⚪", word:"White",  cn:"白色"  }
    ]
},

/* ─── Level 6 · 天气现象 ─────────────────────────────── */
{
    id:   6,
    name: "⛅ 天气现象",
    words: [
        { img:"☀️", word:"Sunny",   cn:"晴天"  },
        { img:"🌧️", word:"Rainy",   cn:"雨天"  },
        { img:"❄️", word:"Snowy",   cn:"雪天"  },
        { img:"⛈️", word:"Stormy",  cn:"暴风雨" },
        { img:"🌫️", word:"Foggy",   cn:"雾天"  },
        { img:"🌬️", word:"Windy",   cn:"刮风"  },
        { img:"🌈", word:"Rainbow", cn:"彩虹"  },
        { img:"⚡", word:"Thunder", cn:"雷电"  }
    ]
},

/* ─── Level 7 · 交通工具 ─────────────────────────────── */
{
    id:   7,
    name: "🚗 交通工具",
    words: [
        { img:"🚗",  word:"Car",         cn:"汽车"   },
        { img:"🚌",  word:"Bus",         cn:"公共汽车" },
        { img:"🚂",  word:"Train",       cn:"火车"   },
        { img:"✈️",  word:"Airplane",    cn:"飞机"   },
        { img:"🚢",  word:"Ship",        cn:"轮船"   },
        { img:"🚲",  word:"Bicycle",     cn:"自行车"  },
        { img:"🏍️",  word:"Motorcycle",  cn:"摩托车"  },
        { img:"🚁",  word:"Helicopter",  cn:"直升机"  }
    ]
},

/* ─── Level 8 · 身体部位 ─────────────────────────────── */
{
    id:   8,
    name: "💪 身体部位",
    words: [
        { img:"👁️", word:"Eye",    cn:"眼睛" },
        { img:"👂", word:"Ear",    cn:"耳朵" },
        { img:"👃", word:"Nose",   cn:"鼻子" },
        { img:"👄", word:"Mouth",  cn:"嘴巴" },
        { img:"✋", word:"Hand",   cn:"手"   },
        { img:"🦶", word:"Foot",   cn:"脚"   },
        { img:"💪", word:"Arm",    cn:"手臂" },
        { img:"🦵", word:"Leg",    cn:"腿"   }
    ]
}

];
