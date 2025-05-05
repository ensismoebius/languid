#include <gtest/gtest.h>
#include "code.cpp"

TEST(PessoaTest, TestaPensamentoEAcordada) {
    Pessoa p;
    p.setPensamento("Estou com sono");
    p.setAcordada(false);

    EXPECT_EQ(p.getPensamento(), "Estou com sono");
    EXPECT_FALSE(p.isAcordada());
}
