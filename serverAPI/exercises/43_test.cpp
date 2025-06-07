#include <gtest/gtest.h>
#include "code.cpp"

TEST(PessoaTest, CriacaoEPropriedades) {
    Pessoa p;
    p.nome = "Ana";
    p.idade = 30;

    EXPECT_EQ(p.nome, "Ana");
    EXPECT_EQ(p.idade, 30);
}
