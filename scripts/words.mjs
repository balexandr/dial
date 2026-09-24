// Curated common-English word bank for Dial, grouped by length. No proper
// nouns, no obscure entries — every word here should be immediately
// recognizable. The generator draws without replacement per length bucket
// (shuffle once, cycle through, reshuffle on wraparound) so repeats only
// happen once a bucket is fully exhausted, not at random — see
// GAME_DESIGN.md's "Word bank" section.
export const WORDS_4 = [
  'ABLE', 'ACHE', 'ACID', 'ACNE', 'ACRE', 'ACTS', 'AGED', 'AGES', 'AIDE', 'ANTS',
  'AIMS', 'ALSO', 'AMID', 'ARCH', 'AREA', 'ARMS', 'ARMY', 'AUNT', 'AUTO', 'AVID',
  'AWAY', 'AXIS', 'BACK', 'BAKE', 'BALD', 'BALL', 'BAND', 'BANK', 'BARE', 'BARK',
  'BARN', 'BASE', 'BATH', 'BEAM', 'BEAN', 'BEAR', 'BEAT', 'BEEF', 'BEEN', 'BEER',
  'BELL', 'BELT', 'BEND', 'BENT', 'BEST', 'BIKE', 'BILL', 'BIND', 'BIRD', 'BITE',
  'BLUE', 'BOAT', 'BODY', 'BOIL', 'BOLD', 'BOLT', 'BOND', 'BONE', 'BOOK', 'BOOM',
  'BOOT', 'BORE', 'BORN', 'BOSS', 'BOTH', 'BOWL', 'BULK', 'BURN', 'BUSH', 'BUSY',
  'CAFE', 'CAGE', 'CAKE', 'CALF', 'CALL', 'CALM', 'CAMP', 'CANE', 'CARD', 'CARE',
  'CASE', 'CASH', 'CAST', 'CAVE', 'CELL', 'CHAT', 'CHEF', 'CHEW', 'CHIN', 'CHIP',
  'CITY', 'CLAM', 'CLAN', 'CLAP', 'CLAW', 'CLAY', 'CLIP', 'CLUB', 'COAL', 'COAT',
  'CODE', 'COIN', 'COLD', 'COLT', 'COMB', 'COME', 'COOK', 'COOL', 'COPE', 'COPY',
  'CORE', 'CORK', 'CORN', 'COST', 'COVE', 'CRAB', 'CREW', 'CROP', 'CUBE', 'CURB',
  'CURE', 'CURL', 'DARE', 'DARK', 'DASH', 'DAWN', 'DEAL', 'DEAR', 'DEBT', 'DECK',
  'DEEP', 'DEER', 'DESK', 'DIAL', 'DICE', 'DIET', 'DIRT', 'DISH', 'DOCK', 'DOES',
  'DOOR', 'DOSE', 'DOVE', 'DRAG', 'DRAW', 'DROP', 'DRUM', 'DUCK', 'DULL', 'DUMP',
  'DUSK', 'DUST', 'DUTY', 'EACH', 'EARN', 'EASE', 'EAST', 'EASY', 'EDGE', 'EPIC',
  'EVEN', 'EVER', 'EXIT', 'FACE', 'FACT', 'FADE', 'FAIL', 'FAIR', 'FALL', 'FAME',
  'FARM', 'FAST', 'FATE', 'FEAR', 'FEAT', 'FEED', 'FEEL', 'FERN', 'FILE', 'FILL',
  'FILM', 'FIND', 'FINE', 'FIRE', 'FIRM', 'FISH', 'FIST', 'FLAG', 'FLAT', 'FLEE',
];

export const WORDS_5 = [
  'ABIDE', 'ABOUT', 'ABOVE', 'ADAPT', 'ADMIT', 'ADOPT', 'ADULT', 'AFTER', 'AGAIN',
  'AGENT', 'AGREE', 'AHEAD', 'ALARM', 'ALBUM', 'ALERT', 'ALIKE', 'ALIVE', 'ALLOW',
  'ALONE', 'ALONG', 'ALTER', 'AMONG', 'ANGEL', 'ANGER', 'ANGLE', 'ANGRY', 'ANKLE',
  'APART', 'APPLE', 'APPLY', 'ARENA', 'ARGUE', 'ARISE', 'ARROW', 'ASIDE', 'ASSET',
  'AVOID', 'AWAIT', 'AWAKE', 'AWARD', 'AWARE', 'BADGE', 'BAKER', 'BASIC', 'BASIN',
  'BATCH', 'BEACH', 'BEGIN', 'BEING', 'BELOW', 'BENCH', 'BERRY', 'BIRTH', 'BLACK',
  'BLADE', 'BLAME', 'BLANK', 'BLAST', 'BLEND', 'BLESS', 'BLIND', 'BLOCK', 'BLOOD',
  'BLOOM', 'BOARD', 'BOAST', 'BONUS', 'BOOST', 'BOOTH', 'BOUND', 'BRAIN', 'BRAND',
  'BRAVE', 'BREAD', 'BREAK', 'BREED', 'BRICK', 'BRIDE', 'BRIEF', 'BRING', 'BROAD',
  'BROOK', 'BROOM', 'BROWN', 'BRUSH', 'BUILD', 'BUNCH', 'BURST', 'CABLE', 'CACHE',
  'CANDY', 'CARGO', 'CARRY', 'CARVE', 'CATCH', 'CAUSE', 'CHAIN', 'CHAIR', 'CHALK',
  'CHARM', 'CHART', 'CHASE', 'CHEAP', 'CHEAT', 'CHECK', 'CHESS', 'CHEST', 'CHIEF',
  'CHILD', 'CHILL', 'CHIME', 'CHOSE', 'CIVIC', 'CLAIM', 'CLASH', 'CLASS', 'CLEAN',
  'CLEAR', 'CLERK', 'CLICK', 'CLIFF', 'CLIMB', 'CLING', 'CLOCK', 'CLOSE', 'CLOTH',
  'CLOUD', 'COACH', 'COAST', 'COLOR', 'COUCH', 'COUGH', 'COULD', 'COUNT', 'COURT',
  'COVER', 'CRACK', 'CRAFT', 'CRANE', 'CRASH', 'CRAWL', 'CRAZY', 'CREAM', 'CREEK',
  'CRISP', 'CROSS', 'CROWD', 'CROWN', 'CRUEL', 'CRUSH', 'CURVE', 'CYCLE', 'DAILY',
  'DANCE', 'DEPTH', 'DIRTY', 'DOUBT', 'DOZEN', 'DRAFT', 'DRAMA', 'DREAM', 'DRESS',
  'DRIFT', 'DRINK', 'DRIVE', 'DROVE', 'DRYER', 'EAGER', 'EARLY', 'EARTH', 'EIGHT',
  'ELBOW', 'ELDER', 'EMPTY', 'ENJOY', 'ENTER', 'EQUAL', 'ERROR', 'EVENT', 'EVERY',
];

export const WORDS_6 = [
  'ABROAD', 'ABSORB', 'ACCEPT', 'ACCESS', 'ACCUSE', 'ACROSS', 'ACTION', 'ACTIVE',
  'ACTUAL', 'ADVICE', 'ADVISE', 'AFFAIR', 'AFFORD', 'AFRAID', 'AGENCY', 'AGREED',
  'ALMOST', 'ALWAYS', 'AMOUNT', 'ANIMAL', 'ANNUAL', 'ANSWER', 'ANYONE', 'APPEAL',
  'APPEAR', 'ARCHER', 'ARRIVE', 'ARTIST', 'ASSIGN', 'ASSIST', 'ASSUME', 'ATTACH',
  'ATTACK', 'ATTEND', 'AUTUMN', 'AVENUE', 'AWAKEN', 'BACKUP', 'BALLOT', 'BANNER',
  'BARREL', 'BASKET', 'BATTLE', 'BEACON', 'BEAVER', 'BECOME', 'BEFORE', 'BEHALF',
  'BEHIND', 'BELIEF', 'BELONG', 'BEETLE', 'BESIDE', 'BETTER', 'BEYOND', 'BINARY',
  'BISHOP', 'BLOUSE', 'BOTHER', 'BOTTLE', 'BOTTOM', 'BOUGHT', 'BRANCH', 'BREATH',
  'BRIDGE', 'BRIGHT', 'BRONZE', 'BUDGET', 'BUFFER', 'BUNDLE', 'BURDEN', 'BUTTER',
  'BUTTON', 'CAMERA', 'CANCEL', 'CANDLE', 'CANNON', 'CANVAS', 'CAPTOR', 'CASINO',
  'CARBON', 'CAREER', 'CARROT', 'CASTLE', 'CASUAL', 'CAUGHT', 'CENSUS', 'CENTER',
  'CHANCE', 'CHANGE', 'CHARGE', 'CHOICE', 'CHOOSE', 'CHOSEN', 'CIRCLE', 'CLIENT',
  'CLOSET', 'CLOSER', 'COLUMN', 'COMBAT', 'COOKIE', 'COMING', 'COMMIT', 'COMMON',
  'CORNER', 'COTTON', 'COUPLE', 'COURSE', 'COUSIN', 'COWBOY', 'CRISIS', 'CUSTOM',
  'DAMAGE', 'DANGER', 'DEBATE', 'DECADE', 'DECIDE', 'DEFEAT', 'DEFEND', 'DEFINE',
  'DEGREE', 'DELETE', 'DEMAND', 'DENIAL', 'DEVOTE', 'DEPUTY', 'DESERT', 'DESIGN',
  'DESIRE', 'DETAIL', 'DETECT', 'DEVICE', 'DIALOG', 'DIGEST', 'DINNER', 'DIRECT',
  'DOCTOR', 'DOMAIN', 'DONATE', 'DOUBLE', 'DRAGON', 'DRAWER', 'DRIVER', 'DURING',
];
