// // @ts-ignore


// class AvatarDirectionAngle {
//   static possibleAngles = [45, 90, 135, 180, 225, 270, 315, 0]
// }

// class AvatarStructure {
//   geometry: AvatarModelGeometry
//   public getBodyParts(_arg_1:String, avatarSetName:String, _arg_3:int):Array
//     {
//         var avatarDirectionAngle:Number = AvatarDirectionAngle.possibleAngles[_arg_3];
//         return (this._geometry.getBodyPartsAtAngle(_arg_1, avatarDirectionAngle, avatarSetName));
//     }
// }


// class AvatarModelGeometry {
//   private getBodyPartsInAvatarSet(bodyPartIdToBodyPart:Dictionary, avatarSetName:String):Array
//     {
//         const bodyParts = [];
//         var bodyPartIds:Array = this.getBodyPartIdsInAvatarSet(avatarSetName);
//         for (const bodyPartId of bodyPartIds) {
//             const bodyPart: GeometryBodyPart = bodyPartIdToBodyPart[bodyPartId];
//             if (bodyPart != null){
//                 bodyParts.push(bodyPart);
//             };
//         };
//         return (bodyParts);
//     }
//   public getBodyPartsAtAngle(_arg_1:String, avatarDirectionAngle: number, geometryID:String):Array
//         {
//             if (geometryID == null){
//                 Logger.log("[AvatarModelGeometry] ERROR: Geometry ID not found for action: ");
//                 return ([]);
//             };
//             var bodyParts: Dictionary = this.getBodyPartsOfType(geometryID);
//             var bodyPartsInAvatarSet:Array = this.getBodyPartsInAvatarSet(bodyParts, _arg_1);
//             var bodyPartDistances = new Array();

//             const rotationMatrix = Matrix4x4.getYRotationMatrix(avatarDirectionAngle);
//             bodyPartsInAvatarSet.forEach((bodyPart: GeometryBodyPart) => {
//               // resumão do que acontece
//               bodypart.xyz = rotationMatrix.vectorMultiplication(bodyPart)
//               const distanceBetween: number = bodyPart.getDistance(this.avatarPosition);
//               bodyPartDistances.push({ distanceBetween, bodyPart });
//             })

//             // função de sort a-z normal considerando distance
//             bodyPartDistances.sort(this.orderByDistance);

//             // retorna lista ordenada das partes com base na menor distância
//             return bodyPartDistances.map(({ distance, bodyPart }) => bodyPart.id);
//         }
// }

// class Matrix4x4 {
//   public static getYRotationMatrix(avatarDirectionAngle: number):Matrix4x4
//   {
//       var angleInRad:Number = ((avatarDirectionAngle * Math.PI) / 180);
//       var cos: number = Math.cos(angleInRad);
//       var sin: number = Math.sin(angleInRad);
//       return (new (Matrix4x4)(cos, 0, sin, 0, 1, 0, -(sin), 0, cos));
//   }
//   public vectorMultiplication(vector3D:Vector3D):Vector3D
//   {
//       var _local_2:Number = (((vector3D.x * this._data[0]) + (vector3D.y * this._data[3])) + (vector3D.z * this._data[6]));
//       var _local_3:Number = (((vector3D.x * this._data[1]) + (vector3D.y * this._data[4])) + (vector3D.z * this._data[7]));
//       var _local_4:Number = (((vector3D.x * this._data[2]) + (vector3D.y * this._data[5])) + (vector3D.z * this._data[8]));
//       return (new Vector3D(_local_2, _local_3, _local_4));
//   }
// }

// class GeometryBodyPart {
//   public getDistance(point: Vector3D): number
//   {
//       var min:Number = Math.abs(((point.z - this.transformedLocation.z) - this._radius));
//       var max:Number = Math.abs(((point.z - this.transformedLocation.z) + this._radius));
//       return (Math.min(min, max));
//   }
// }
