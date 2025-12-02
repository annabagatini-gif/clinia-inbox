# 🚀 Passo a Passo EXATO para Rodar o Onboarding no PowerShell

## ⚠️ IMPORTANTE: Mantenha o PowerShell ABERTO enquanto o projeto estiver rodando!

---

## 📋 Passo a Passo COMPLETO (Execute na Ordem Exata)

### ✅ PASSO 1: Abrir o PowerShell
**Escolha uma das opções:**
- Pressione `Windows + X` → Escolha "Windows PowerShell" ou "Terminal"
- **OU** pesquise "PowerShell" no menu Iniciar e clique para abrir
- **OU** pressione `Windows + R`, digite `powershell` e pressione ENTER

**✅ Verificação:** Você deve ver uma janela azul/preta com texto branco

---

### ✅ PASSO 2: Navegar até a pasta do projeto
**Copie e cole este comando EXATO no PowerShell:**
```powershell
cd C:\Users\DELL\Prototipos\clinia-inbox
```

**Pressione ENTER**

**✅ Verificação:** Execute `pwd` e deve aparecer: `C:\Users\DELL\Prototipos\clinia-inbox`

---

### ✅ PASSO 3: Verificar se Node.js está instalado
**Copie e cole:**
```powershell
node --version
```

**✅ Deve aparecer:** `vXX.X.X` (qualquer versão 18 ou superior)

**❌ Se aparecer erro:** Instale Node.js em https://nodejs.org/ e **REINICIE o PowerShell**

---

### ✅ PASSO 4: Verificar se npm está instalado
**Copie e cole:**
```powershell
npm --version
```

**✅ Deve aparecer:** `XX.X.X` (qualquer versão)

**❌ Se aparecer erro:** Instale Node.js (inclui npm) em https://nodejs.org/

---

### ✅ PASSO 5: Parar TODOS os processos Node.js antigos
**Copie e cole este comando:**
```powershell
Get-Process | Where-Object {$_.ProcessName -eq "node"} | Stop-Process -Force
```

**Pressione ENTER**

**✅ Verificação:** Não deve aparecer nenhum erro (ou pode aparecer aviso de processo não encontrado, isso é normal)

---

### ✅ PASSO 6: Limpar o cache do Next.js
**Copie e cole:**
```powershell
Remove-Item -Path .next -Recurse -Force -ErrorAction SilentlyContinue
```

**Pressione ENTER**

**✅ Verificação:** Não deve aparecer nenhum erro

---

### ✅ PASSO 7: Verificar se as dependências estão instaladas
**Copie e cole:**
```powershell
Test-Path node_modules
```

**✅ Se aparecer `True`:** Pule para o PASSO 9

**❌ Se aparecer `False`:** Continue para o PASSO 8

---

### ✅ PASSO 8: Instalar dependências (só se necessário)
**Copie e cole:**
```powershell
npm install
```

**Pressione ENTER**

**⏳ Aguarde:** Pode demorar 2-5 minutos na primeira vez

**✅ Verificação:** Deve aparecer "added XXX packages" ou "up to date"

---

### ✅ PASSO 9: Iniciar o servidor de desenvolvimento
**Copie e cole:**
```powershell
npm run dev
```

**Pressione ENTER**

**⏳ Aguarde:** Pode demorar 10-30 segundos

---

### ✅ PASSO 10: Aguardar a mensagem de sucesso
**Você DEVE ver algo assim:**
```
  ▲ Next.js 16.0.1
  - Local:        http://localhost:3000
  - Ready in Xs
```

**✅ Verificação:** Deve aparecer "Ready" na última linha

**⚠️ IMPORTANTE:** NÃO FECHE O POWERSHELL! Ele precisa ficar aberto e rodando.

---

### ✅ PASSO 11: Abrir no navegador
**Escolha uma das opções:**

**Opção A - Página de Onboarding (Recomendado):**
1. Abra seu navegador (Chrome, Edge, Firefox, etc.)
2. Digite na barra de endereço: `http://localhost:3000/onboarding`
3. Pressione ENTER

**Opção B - Página Principal:**
1. Abra seu navegador
2. Digite: `http://localhost:3000`
3. Pressione ENTER

**✅ Verificação:** Você deve ver a página carregar sem erros

---

### ✅ PASSO 12: Verificar se o tour está funcionando
- A página de onboarding deve aparecer
- O tour deve iniciar automaticamente após alguns segundos
- Se não aparecer, aguarde 5-10 segundos e recarregue a página (`F5`)

---

### 🛑 PASSO 13: Para parar o servidor (quando terminar)
**No PowerShell, pressione:** `Ctrl + C`

**✅ Verificação:** Deve aparecer "Terminated" ou o cursor voltar ao normal

---

## 🎯 Comandos Rápidos (Copiar e Colar Tudo de Uma Vez)

**⚠️ ATENÇÃO:** Execute um comando por vez, aguardando cada um terminar antes do próximo!

```powershell
# 1. Ir para a pasta do projeto
cd C:\Users\DELL\Prototipos\clinia-inbox

# 2. Parar processos Node antigos
Get-Process | Where-Object {$_.ProcessName -eq "node"} | Stop-Process -Force

# 3. Limpar cache do Next.js
Remove-Item -Path .next -Recurse -Force -ErrorAction SilentlyContinue

# 4. Iniciar servidor (aguarde aparecer "Ready")
npm run dev
```

**✅ Depois que aparecer "Ready" no PowerShell, abra no navegador:** `http://localhost:3000/onboarding`

**⚠️ LEMBRE-SE:** Mantenha o PowerShell aberto enquanto estiver testando!

---

## 🔧 Solução de Problemas Comuns

### ❌ Problema: "Porta 3000 já está em uso"
**Sintoma:** Aparece erro dizendo que a porta 3000 está ocupada

**Solução Passo a Passo:**
```powershell
# 1. Ver qual processo está usando a porta 3000
netstat -ano | findstr :3000

# 2. Parar todos os processos Node
Get-Process | Where-Object {$_.ProcessName -eq "node"} | Stop-Process -Force

# 3. Tentar novamente
npm run dev
```

**✅ Verificação:** Deve iniciar sem erro de porta

---

### ❌ Problema: "npm não é reconhecido" ou "node não é reconhecido"
**Sintoma:** Aparece erro dizendo que o comando não foi encontrado

**Solução:**
1. Instale o Node.js: https://nodejs.org/ (baixe a versão LTS)
2. **IMPORTANTE:** Feche TODOS os PowerShells abertos
3. Abra um NOVO PowerShell
4. Verifique se funcionou:
   ```powershell
   node --version
   npm --version
   ```
5. Se ainda não funcionar, reinicie o computador

---

### ❌ Problema: Mudanças não aparecem no navegador
**Sintoma:** Você alterou o código mas não vê as mudanças no navegador

**Solução Completa Passo a Passo:**
```powershell
# 1. No PowerShell, pare o servidor
# Pressione: Ctrl + C

# 2. Limpe o cache
Remove-Item -Path .next -Recurse -Force -ErrorAction SilentlyContinue

# 3. Reinicie o servidor
npm run dev

# 4. AGUARDE aparecer "Ready"
```

**No navegador:**
1. Pressione `Ctrl + Shift + R` (recarregar forçado) ou `F5`
2. **Certifique-se de que o PowerShell está ABERTO e rodando**

---

### ❌ Problema: Erro de compilação no PowerShell
**Sintoma:** Aparecem erros vermelhos ao executar `npm run dev`

**Solução:**
```powershell
# 1. Pare o servidor (Ctrl + C)

# 2. Limpe tudo
Remove-Item -Path .next -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path node_modules -Recurse -Force -ErrorAction SilentlyContinue

# 3. Reinstale dependências
npm install

# 4. Reinicie
npm run dev
```

---

### ❌ Problema: Erro de encoding UTF-8 (caracteres estranhos)
**Sintoma:** Aparecem símbolos estranhos no PowerShell

**Solução:**
```powershell
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
```

Execute este comando antes de rodar `npm run dev`

---

### ❌ Problema: Página não carrega (erro de conexão)
**Sintoma:** Navegador não consegue conectar em localhost:3000

**Solução:**
1. Verifique se o PowerShell está aberto
2. Verifique se apareceu "Ready" no PowerShell
3. Verifique se não há erros vermelhos no PowerShell
4. Tente acessar: `http://127.0.0.1:3000/onboarding` (em vez de localhost)
5. Verifique seu firewall/antivírus não está bloqueando

---

### ⚠️ Checklist Completo: Se NADA funcionar

Execute esta verificação passo a passo:

- [ ] **PowerShell está aberto?** (não pode estar fechado)
- [ ] **Está na pasta correta?** Execute `pwd` e verifique
- [ ] **Node.js está instalado?** Execute `node --version`
- [ ] **npm está instalado?** Execute `npm --version`
- [ ] **Processos antigos foram parados?** Execute o comando do PASSO 5
- [ ] **Cache foi limpo?** Execute o comando do PASSO 6
- [ ] **Dependências estão instaladas?** Execute `Test-Path node_modules` (deve ser True)
- [ ] **`npm run dev` está rodando?** (deve estar executando)
- [ ] **Apareceu "Ready" no PowerShell?** (deve aparecer)
- [ ] **PowerShell está visível?** (não minimizado)
- [ ] **Recarregou a página no navegador?** (`Ctrl + Shift + R`)
- [ ] **Está acessando a URL correta?** `http://localhost:3000/onboarding`
- [ ] **Aguardou alguns segundos?** (às vezes demora para carregar)

---

## 📝 Resumo Rápido (Para Quem Já Sabe)

**Execute estes comandos na ordem (um por vez):**

```powershell
cd C:\Users\DELL\Prototipos\clinia-inbox
Get-Process | Where-Object {$_.ProcessName -eq "node"} | Stop-Process -Force
Remove-Item -Path .next -Recurse -Force -ErrorAction SilentlyContinue
npm run dev
```

**Depois que aparecer "Ready":**
- Abra: `http://localhost:3000/onboarding`
- **MANTENHA O POWERSHELL ABERTO!**

---

## 🔄 Quando Fizer Mudanças no Código

### Opção 1: Hot Reload Automático (Recomendado)
1. **MANTENHA o PowerShell aberto** com `npm run dev` rodando
2. Salve o arquivo no seu editor (VS Code, etc.)
3. O Next.js vai recompilar automaticamente (você verá no PowerShell)
4. Recarregue a página no navegador (`F5` ou `Ctrl + R`)

### Opção 2: Reiniciar o Servidor (Se não funcionar)
1. No PowerShell, pressione `Ctrl + C` para parar
2. Execute novamente: `npm run dev`
3. Aguarde aparecer "Ready"
4. Recarregue a página no navegador

---

## 📚 Informações Úteis

- **URL do Onboarding:** `http://localhost:3000/onboarding`
- **URL Principal:** `http://localhost:3000`
- **Porta Padrão:** 3000
- **Framework:** Next.js 16.0.1
- **Pasta do Projeto:** `C:\Users\DELL\Prototipos\clinia-inbox`

---

## ✅ Pronto!

Agora você tem tudo que precisa para rodar o projeto de onboarding no PowerShell. Siga os passos na ordem e não pule nenhuma verificação!

