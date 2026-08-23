# 00a — Simulador de Urna Eletrônica ES 2026

Simulador educacional de uma urna eletrônica para as Eleições Gerais de 2026 no Espírito Santo.

> **Importante:** este projeto é uma simulação independente e não é um software oficial do TSE. Não deve ser usado para votação real.

## O que existe

- Fluxo de votação inspirado na ordem oficial de 2026: Deputado Federal, Deputado Estadual, Senador, Governador e Presidente.
- Dados de candidaturas de 2026 carregados a partir de arquivos públicos derivados do conjunto de dados do TSE.
- Teclado numérico na tela e suporte ao teclado físico.
- Confirmação, correção e voto em branco.
- Registro local de cada cédula no navegador usando IndexedDB.
- Identificador da urna/simulação e timestamp por voto.
- Exportação de todos os votos para JSON e CSV para apuração posterior.
- Importação de um arquivo JSON de votos para recuperar uma simulação em outro navegador.
- Apuração local por cargo e candidato.

## Dados de candidatos

O TSE disponibiliza o conjunto **Candidatos - 2026** no Portal de Dados Abertos. O aplicativo usa uma cópia pública dos CSVs para facilitar a execução no navegador.

Fontes:
- TSE — https://dadosabertos.tse.jus.br/pt_BR/dataset/candidatos-2026
- TSE — Resolução nº 23.751/2026, que descreve o fluxo da votação.

## Como executar

Abra `index.html` em um navegador moderno. Para evitar limitações de CORS em alguns navegadores, recomenda-se servir a pasta por um servidor HTTP local, por exemplo:

```bash
python -m http.server 8080
```

Depois acesse `http://localhost:8080`.

## Armazenamento

Os votos não são enviados ao GitHub e não são enviados a um servidor. Eles ficam no **IndexedDB do navegador**, separados por simulação/urna. Use **Exportar votos** para produzir um arquivo que pode ser arquivado e posteriormente importado para a apuração.

## Licença

Código deste projeto: MIT. Dados de candidaturas permanecem sujeitos à licença e às condições da fonte original.