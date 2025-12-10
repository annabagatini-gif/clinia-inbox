# PASSO A PASSO EXATO - Rodar Projeto no PowerShell

## ⚠️ IMPORTANTE: O PowerShell DEVE ESTAR ABERTO E RODANDO!

O servidor Next.js precisa estar rodando no PowerShell para que as mudanças apareçam no navegador.

---

## 📋 PASSO A PASSO COMPLETO

### PASSO 1: Abrir o PowerShell
1. Pressione `Windows + X`
2. Clique em "Windows PowerShell" ou "Terminal"
3. Ou pesquise "PowerShell" no menu Iniciar e abra

### PASSO 2: Navegar até a pasta do projeto
**Copie e cole este comando no PowerShell:**
```powershell
cd C:\Users\DELL\Prototipos\clinia-inbox
```

**Pressione ENTER**

### PASSO 3: Verificar se está na pasta correta
**Copie e cole:**
```powershell
pwd
```

**Deve aparecer:** `C:\Users\DELL\Prototipos\clinia-inbox`

### PASSO 4: Parar TODOS os processos Node antigos
**Copie e cole este comando:**
```powershell
Get-Process | Where-Object {$_.ProcessName -eq "node"} | Stop-Process -Force
```

**Pressione ENTER**

### PASSO 5: Limpar o cache do Next.js
**Copie e cole:**
```powershell
Remove-Item -Path .next -Recurse -Force -ErrorAction SilentlyContinue
```

**Pressione ENTER**

### PASSO 6: Verificar se as dependências estão instaladas
**Copie e cole:**
```powershell
Test-Path node_modules
```

**Se aparecer `False`, execute:**
```powershell
npm install
```

**Aguarde terminar (pode demorar alguns minutos)**

### PASSO 7: Iniciar o servidor de desenvolvimento
**Copie e cole:**
```powershell
npm run dev
```

**Pressione ENTER**

### PASSO 8: AGUARDAR a mensagem de sucesso
Você DEVE ver algo assim:
```
▲ Next.js 16.0.1
- Local:        http://localhost:3000
- Ready in Xs
```

**⚠️ NÃO FECHE O POWERSHELL!** Ele precisa ficar aberto e rodando.

### PASSO 9: Abrir o navegador
1. Abra seu navegador (Chrome, Edge, Firefox, etc.)
2. Digite na barra de endereço: `http://localhost:3000/onboarding`
3. Pressione ENTER

### PASSO 10: Verificar se está funcionando
- Você deve ver a página de onboarding
- O tour deve iniciar automaticamente após alguns segundos
- Se não aparecer, aguarde mais alguns segundos e recarregue a página (`F5`)

---

## 🔄 QUANDO FIZER MUDANÇAS NO CÓDIGO

### Opção 1: Hot Reload Automático (Recomendado)
1. **MANTENHA o PowerShell aberto** com `npm run dev` rodando
2. Salve o arquivo no seu editor (VS Code, etc.)
3. O Next.js vai recompilar automaticamente
4. Recarregue a página no navegador (`F5`)

### Opção 2: Reiniciar o Servidor (Se não funcionar)
1. No PowerShell, pressione `Ctrl + C` para parar o servidor
2. Execute novamente:
   ```powershell
   npm run dev
   ```
3. Aguarde aparecer "Ready"
4. Recarregue a página no navegador

---

## 🛑 PARA PARAR O SERVIDOR

No PowerShell, pressione: `Ctrl + C`

---

## ❌ PROBLEMAS COMUNS

### Problema: "Porta 3000 já está em uso"
**Solução:**
```powershell
# Ver qual processo está usando
netstat -ano | findstr :3000

# Parar todos os processos Node
Get-Process | Where-Object {$_.ProcessName -eq "node"} | Stop-Process -Force

# Tentar novamente
npm run dev
```

### Problema: Mudanças não aparecem
**Solução:**
1. Pare o servidor (`Ctrl + C`)
2. Limpe o cache:
   ```powershell
   Remove-Item -Path .next -Recurse -Force
   ```
3. Reinicie:
   ```powershell
   npm run dev
   ```
4. Recarregue a página no navegador (`Ctrl + R` ou `F5`)

### Problema: Erro de compilação
**Solução:**
1. Pare o servidor (`Ctrl + C`)
2. Limpe tudo:
   ```powershell
   Remove-Item -Path .next -Recurse -Force
   Remove-Item -Path node_modules -Recurse -Force
   ```
3. Reinstale:
   ```powershell
   npm install
   ```
4. Reinicie:
   ```powershell
   npm run dev
   ```

---

## ✅ CHECKLIST RÁPIDO

Antes de acessar o navegador, verifique:

- [ ] PowerShell está aberto
- [ ] Está na pasta correta (`cd C:\Users\DELL\Prototipos\clinia-inbox`)
- [ ] Processos antigos foram parados
- [ ] Cache foi limpo
- [ ] `npm run dev` está rodando
- [ ] Apareceu a mensagem "Ready" no PowerShell
- [ ] PowerShell está aberto e visível (não minimizado)

---

## 📝 COMANDOS COMPLETOS (Copiar Tudo de Uma Vez)

```powershell
# 1. Ir para a pasta
cd C:\Users\DELL\Prototipos\clinia-inbox

# 2. Parar processos antigos
Get-Process | Where-Object {$_.ProcessName -eq "node"} | Stop-Process -Force

# 3. Limpar cache
Remove-Item -Path .next -Recurse -Force -ErrorAction SilentlyContinue

# 4. Instalar dependências (só se necessário)
npm install

# 5. Iniciar servidor
npm run dev
```

**Depois que aparecer "Ready", abra:** `http://localhost:3000/onboarding`




