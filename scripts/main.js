function register(unit){
    EntityMapping.nameMap.put(unit.name, unit.constructor);

    unit.classId = -1;
    for (var i in EntityMapping.idMap) {
        if (!EntityMapping.idMap[i]) {
            EntityMapping.idMap[i] = unit.constructor;
            unit.classId = i;
            return;
        }
    }
    throw new IllegalArgumentException(unit.name + " has no class ID");
};

function hasEquipment(unit){
    let hasEquipment = false;
    for(let i = 0; i < EquippedStatus.length; i++){
        if(unit.hasEffect(EquippedStatus[i])) hasEquipment = true;
        }
    return hasEquipment;
};

//This is effectively the equipment class

const EquipmentUnits = []

const EquippedStatus = []

//atx = this.attachedTo.x;
//aty = this.attachedTo.y;
//atr = this.attachedTo.rotation;

//const {x: atx, y: aty, rotation: atr} = this.attachedTo;

//This is where all statuses get deffined

const EquippedToUnit = extend(StatusEffect, "EquippedToUnit", {
    isHidden(){
      return false;
    },
    localizedName: "Equipped",
    damage: -0.2,
    permanent: true
});
EquippedStatus.push(EquippedToUnit)

const ArmorEquipped = extend(StatusEffect, "Armor", {
    isHidden(){
      return false;
    },
    localizedName: "Armor Equipped",
    speedMultiplier: 0.8,
    healthMultiplier: 1.25,
    permanent: true,
    //Custom Effect part
    update(u, t){}
});
EquippedStatus.push(ArmorEquipped)

const ArmorEquippedS = extend(StatusEffect, "ArmorPlusS", {
    isHidden(){
      return false;
    },
    localizedName: "Surge Armor Equipped",
    speedMultiplier: 0.8,
    healthMultiplier: 1.50,
    permanent: true,
    //Custom Effect part
    update(u, t){}
});
EquippedStatus.push(ArmorEquippedS)

const MinerEquipped = extend(StatusEffect, "Miner", {
    isHidden(){
      return false;
    },
    localizedName: "Miner Equipped",
    speedMultiplier: 0.8,
    permanent: true
});
EquippedStatus.push(MinerEquipped)

const BuilderEquipped = extend(StatusEffect, "Builder", {
    isHidden(){
      return false;
    },
    localizedName: "Builder Equipped",
    speedMultiplier: 0.8,
    buildSpeedMultiplier: 1.2,
    permanent: true
});
EquippedStatus.push(BuilderEquipped)

const HealerEquipped = extend(StatusEffect, "Healer", {
    isHidden(){
      return false;
    },
    localizedName: "Healer Equipped",
    speedMultiplier: 0.8,
    damage: -0.2,
    permanent: true
});
EquippedStatus.push(HealerEquipped)

const ProtectorEquipped = extend(StatusEffect, "Protector", {
    isHidden(){
      return false;
    },
    localizedName: "Protector Equipped",
    speedMultiplier: 0.8,
    permanent: true
});
EquippedStatus.push(ProtectorEquipped)

const ClockerEquipped = extend(StatusEffect, "Clocker", {
    isHidden(){
      return false;
    },
    localizedName: "Clocker Equipped",
    speedMultiplier: 1.25,
    damageMultiplier: 1.25,
    healthMultiplier: 1.25,
    reloadMultiplier: 1.25,
    buildSpeedMultiplier: 1.25,
    damage: 0.5,
    permanent: true,
    //Custom Effect part
    update(u, t){}
});
EquippedStatus.push(ProtectorEquipped)

const ThiefEquipped = extend(StatusEffect, "Thief", {
    isHidden(){
      return false;
    },
    localizedName: "Thief Equipped",
    speedMultiplier: 1.25,
    permanent: true,
});
EquippedStatus.push(ThiefEquipped)

const WaterCoolerEquipped = extend(StatusEffect, "WaterCooler", {
    isHidden(){
      return false;
    },
    localizedName: "WaterCooler Equipped",
    speedMultiplier: 0.8,
    damageMultiplier: 1.25,
    reloadMultiplier: 1.25,
    permanent: true
});
EquippedStatus.push(WaterCoolerEquipped)

const SniperEquipped = extend(StatusEffect, "Sniper", {
    isHidden(){
      return false;
    },
    localizedName: "Sniper Equipped",
    speedMultiplier: 0.8,
    damageMultiplier: 1.5,
    reloadMultiplier: 0.5,
    permanent: true,
    //Custom Effect part
    update(u, t){}
});
EquippedStatus.push(SniperEquipped)


const GatlingEquipped = extend(StatusEffect, "Gatling", {
    isHidden(){
      return false;
    },
    localizedName: "Gatling Equipped",
    speedMultiplier: 0.8,
    damageMultiplier: 0.5,
    reloadMultiplier: 2.0,
    permanent: true
});
EquippedStatus.push(GatlingEquipped)

const RocketEquipped = extend(StatusEffect, "Rocket", {
    isHidden(){
      return false;
    },
    localizedName: "Rocket Equipped",
    speedMultiplier: 0.5,
    permanent: true
});
EquippedStatus.push(RocketEquipped)

//E = Equipment

//equipment-D = Deffensive
//equipment-O = Offensive
//equipment-M = Mining
//equipment-U = utility

//E-?-(First letter of TYPE/JOB) = TYPE/JOB

//Any duplicates get a 2 or on added to end

//equipment-d-ShieldArmorCore = ?

const plackart = extend(UnitType, "plackart", {
    localizedName: "Defensive Equipment:Plackart",
    hitSize: 8,
    speed: 0,
    flying: true,
    canDrown: false
});
plackart.constructor = () => extend(UnitEntity, {
    classId: () => plackart.classId,
    write(write){
        this.super$write(write);
        write.f(1);
    },
    read(read, revision){
        this.super$read(read);
        Log.info(read.f());
    },
    draw(){
        Draw.z(59);
        Draw.rect(this.type.outlineRegion, this.x, this.y, this.rotation - 90);
        Draw.z(116);
        Draw.rect(this.type.region, this.x, this.y, this.rotation - 90);
    },
    attached: false,
    attachedTo: null,
    maxSP: 0,
        update(){
        this.super$update();
            if(this.attachedTo == null || !this.attachedTo.isAdded()){
                this.attachedTo = Units.closest(this.team, this.x, this.y, 12, u => u != this && EquipmentUnits.indexOf(u.type) == -1 && !hasEquipment(u)== true);

                if(this.attachedTo != null){
                this.maxSP = (this.attachedTo.shield + ( this.attachedTo.maxHealth / 2));
                this.attachedTo.shield += (this.maxSP - this.attachedTo.shield);
                this.attachedTo.apply(ArmorEquipped, 7);
                }
            }
            else{
                const {x: atx, y: aty, rotation: atr} = this.attachedTo;
                this.apply(EquippedToUnit, 7);
                this.attachedTo.apply(ArmorEquipped, 7);
                this.x = atx;
                this.y = aty;
                this.rotation = atr;
                this.elevation = this.attachedTo.isFlying() ? 0 : 1;
          }
    }
});
register(plackart);
EquipmentUnits.push(plackart)

//equipment-D-SurgeArmorCore =(proximity Shock counter)

//equipment-M-SuperStorgageMiner = (selectable mineing target)(backpack that adverages thier inventories and unloads them both at core)

//equipment-U-2x Builder(always target diffrent buildings) =

//equipment-D-Regen/BeamHealer = Tent

//equipment-D-PulseHealer/ShareShield = Bandage

//equipment-A-OverClocker(Exsplosion(on death/unit death)+Buff everything 1.25) = Reactor

//equipment-U-Thief(steals from enemy conveyers)(has toggleable tractor beam and repulsion beam) = Sack

//equipment-O-WaterCooler = (puts out fires)

//equipment-O-LongRange = Sniper (give piercing or Range boost)

//equipment-O-Rapid = Gatlin (2.0 Load speed damage .50)

//equipment-O-Aoe = Rocket (aoe stomp(with knock back as well as rocket aoe weapon)


//Debug
Vars.enableConsole = true
