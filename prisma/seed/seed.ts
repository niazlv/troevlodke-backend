import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
import * as argon from 'argon2';
import * as fs from 'fs';
import path from 'path/posix';

function getDataFromFile(filename:string) {
    var linesSplit = [];

    var f = fs.readFileSync(filename,'utf8');
    var tabs:number;
    f = f.replace(/  +/g, ' ');
    var lines = f.split("\n");
    for(var i = 1; i < lines.length; i++) {
        //if(!linesSplit[0]) linesSplit[0] = [];
        linesSplit[i-1] = lines[i].split(' ');
        linesSplit[i-1][0] = Number(linesSplit[i-1][0]);
    }
    return linesSplit;
}

async function main() {
    var count:number;


    /** Create roles */
    const roles = getDataFromFile("./src/role.txt");
    count = 0;
    var data_roles = await prisma.role.findMany({});
    for(var i = 0; i < data_roles.length; i++) {
        if(data_roles[i].bit == roles[i][0] && data_roles[i].name == roles[i][1]) count++;
    }
    if(count != roles.length) {
        for(var i = 0; i < roles.length; i++) {
            var role = await prisma.role.upsert({
                create:{
                    bit: roles[i][0],
                    name: roles[i][1],
                },
                update:{/** Nothing*/},
                where: {
                    bit: roles[i][0],
                },
            });
            console.log(role);
        }
        console.debug("roles created!");
    }
    
    /** Create permissions */
    const permissions = getDataFromFile("./src/permissions.txt");
    count = 0;
    var data_permissions = await prisma.permissions.findMany({});
    for(var i = 0; i < data_permissions.length; i++) {
        if(data_permissions[i].bit == permissions[i][0] && data_permissions[i].name == permissions[i][1]) count++;
    }
    if(count != permissions.length) {
        for(var i = 0; i < permissions.length; i++) {
            var permission = await prisma.permissions.upsert({
                create:{
                    bit: permissions[i][0],
                    name: permissions[i][1],
                },
                update:{/** Nothing*/},
                where: {
                    bit: permissions[i][0],
                },
            });
            console.log(permission);
        }
        console.debug("permissions created");
    }

    /** create admin */
    const hash = await argon.hash("123");
    try {
        var admin = await prisma.user.create({
            data: {
                id:1,
                login: "admin",
                hash: hash,
                permissions: BigInt(BigInt(1n<<32n)-1n),
                role: 1
            }
        });
        console.log(admin)
        console.debug("admin created");
    } catch(error) {
        if(error.code == "P2002") {
            console.warn("admin is exist");
        }
        else {
            console.warn("admin not created!");
            console.error(error);
        }
    }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });